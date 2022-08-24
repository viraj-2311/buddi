import datetime
import json
import os
import tempfile
from tempfile import mkdtemp

from django.forms.models import model_to_dict
from django.http import HttpResponse

from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.jobs.constants import (ACCOUNT_COMPANY_CONTRACTOR_RELATIONS, ACCOUNT_COMPANY_OWN_RELATIONS,
                                 ACCOUNT_COMPANY_RELATION_CONTRACTOR, CAN_NOT_ACTIVATE_JOB_MSG, DEAL_MEMO, HOLD_MEMO,
                                 JOB_STATUS_ACTIVE, JOB_STATUS_PENDING, JOB_STATUS_WRAPPED,
                                 MAJOR_FOUR_ROLES_DELETE_MESSAGE, MAJOR_FOUR_ROLES_GROUP_DELETE_MESSAGE,
                                 MAJOR_FOUR_ROLES_GROUP_UPDATE_MESSAGE, CAN_NOT_MOVE_JOB_FROM_WRAPPED_TO_ACTIVE,
                                 CAN_NOT_MOVE_JOB_FROM_WRAPPED_TO_HOLD, CAN_NOT_MOVE_JOB_FROM_ACTIVE_TO_HOLD)
from apps.jobs.models import (CallSheetJobMemo, CompanyDashboardJobRoles, CrewTemplate, Job, JobMemo, JobMemoAttachment,
                              JobMemoShootDate, JobRole, JobRoleGroup, JobRoleGroupId, JobRoleGroupType, JobRoleId,
                              JobRoleType, JobSettings, JobShootDate, PreProductionBook, Schedule, ShootNote,
                              UserSchedule, VirtualMemo, JobMemoRate)
from apps.jobs.permissions import can_access_job, can_activate_job
from apps.jobs.serializers import (CrewTemplateSerializer, JobGallerySerializer, JobReadSerializer,
                                   JobRoleGroupSerializer, JobRoleGroupTypeReadSerializer,
                                   JobRoleGroupTypeWriteSerializer, JobRoleSerializer, JobRoleTypeReadSerializer,
                                   JobRoleTypeWriteSerializer, JobWriteSerializer, ScheduleReadSerializer,
                                   ShootNoteReadSerializer, JobMemoSerializer, JobGalleryArchiveSerializer)
from apps.jobs.utils import add_field_in_request_data, retrieve_all_departments, get_w9_documents_for_job, \
    get_invoice_documents_for_job, get_all_documents_for_job_zipped, get_w9list_documents_for_job, \
    dump_files_in_dir_to_zip
from apps.jobs.view.crew import set_rates
from apps.user.constants import (DIRECTOR, EXECUTIVE_PRODUCER, LINE_PRODUCER, PRODUCTION_COORDINATOR,
                                 PRODUCTION_MANAGER, TALENT, BAND_LEADER, SECOND_BAND_LEADER, THIRD_BAND_LEADER)
from apps.user.models import BenjiAccount, Company, CompanyBenjiAccountEntry
from apps.user.utils import get_account_company_relationship, set_contractor_relationship
from apps.user.serializers import CompanySerializer
from apps.finance.render import Render
from apps.finance.models import Invoice


def create_virtual_memo_with_benji_account(benji_account, job_role):
    if job_role:
        VirtualMemo(benji_account=benji_account,
                    job_role=JobRole.objects.get(pk=job_role),
                    choice_level=1).save()


def create_virtual_memo_with_full_name(full_name, job_role):
    if job_role and full_name != "":
        VirtualMemo(full_name=full_name,
                    job_role=JobRole.objects.get(pk=job_role),
                    choice_level=1).save()


def job_role_exists_in_the_template(job_role, template):
    job_role_group_title = job_role.job_role_group.job_role_group_type.title
    job_role_title = job_role.job_role_type.title
    for group_type in template:
        role_types_list = template[group_type]
        if job_role_group_title == group_type and job_role_title in role_types_list:
            return True
    return False


def get_job_detail(job):
    company = job.company
    response_data = JobReadSerializer(instance=job).data
    if isinstance(job.exec_producer, BenjiAccount):
        response_data["exec_producer"]["company_title"] = company.title
        response_data["exec_producer"]["company_relationship"] = get_account_company_relationship(
            company, job.exec_producer,
        )
    if isinstance(job.line_producer, BenjiAccount):
        response_data["line_producer"]["company_title"] = company.title
        response_data["line_producer"]["company_relationship"] = get_account_company_relationship(
            company, job.line_producer,
        )
    if isinstance(job.director, BenjiAccount):
        response_data["director"]["company_title"] = company.title
        response_data["director"]["company_relationship"] = get_account_company_relationship(
            company, job.director,
        )
    return response_data


def _get_contractor_all_jobs_in_company(company, user):
    can_view = True
    pc_benji_account_entry = CompanyBenjiAccountEntry.objects.get(company=company,
                                                                  benji_account=user)
    if pc_benji_account_entry.relationship in ACCOUNT_COMPANY_OWN_RELATIONS:
        jobs = Job.objects.filter(company=company).order_by("-created_at")
    elif pc_benji_account_entry.relationship in ACCOUNT_COMPANY_CONTRACTOR_RELATIONS:
        jobs = []
        job_memos = JobMemo.objects.filter(benji_account=user,
                                           job_role__job_role_group__job__company=company)
        for job_memo in job_memos:
            job = job_memo.job_role.job_role_group.job
            if can_access_job(user, job_memo):
                jobs.append(job)
    else:
        jobs = []
        can_view = False
    return jobs, can_view


class JobRoleGroupTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = JobRoleGroupType.objects.all()
    serializer_class = JobRoleGroupTypeReadSerializer

    def create(self, request):
        company = Company.objects.get(pk=request.data["company_id"])
        add_field_in_request_data(request, "company", company.pk)
        add_field_in_request_data(request, "job", request.data["job"])
        job_role_group_type_serializer = JobRoleGroupTypeWriteSerializer(data=request.data)
        if job_role_group_type_serializer.is_valid(raise_exception=True):
            job_role_group_type_serializer.save()
        return Response(self.serializer_class(job_role_group_type_serializer.data).data,
                        status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobRoleGroupTypeViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        try:
            job_role_group_type = JobRoleGroupType.objects.get(pk=pk)
            if job_role_group_type.title in ["Production"]:
                return Response({"message": MAJOR_FOUR_ROLES_GROUP_UPDATE_MESSAGE}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return super(JobRoleGroupTypeViewSet, self).partial_update(request=request, pk=pk)
        except JobRoleGroupType.DoesNotExist:
            exit()
        return Response({}, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return super(JobRoleGroupTypeViewSet, self).destroy(request=request, pk=pk)


class JobRoleTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = JobRoleType.objects.all()
    serializer_class = JobRoleTypeReadSerializer

    def create(self, request):
        company = Company.objects.get(pk=request.data["company_id"])
        add_field_in_request_data(request, "company", company.pk)
        add_field_in_request_data(request, "job", request.data["job"])
        job_role_type_serializer = JobRoleTypeWriteSerializer(data=request.data)
        if job_role_type_serializer.is_valid(raise_exception=True):
            job_role_type_serializer.save()
        return Response(self.serializer_class(job_role_type_serializer.data).data,
                        status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobRoleTypeViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        major_job_roles_list = ["Exec Producer", "Line Producer", "Production Manager", "Production Coordinator"]
        try:
            job_role_type = JobRoleType.objects.get(pk=pk)
            if job_role_type.title in major_job_roles_list:
                return Response({"message": MAJOR_FOUR_ROLES_GROUP_UPDATE_MESSAGE}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return super(JobRoleTypeViewSet, self).partial_update(request=request, pk=pk)
        except JobRoleType.DoesNotExist:
            pass
        return Response({}, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return super(JobRoleTypeViewSet, self).destroy(request=request, pk=pk)


class JobRoleGroupViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = JobRoleGroup.objects.all()
    serializer_class = JobRoleGroupSerializer

    def destroy(self, request, pk=None):
        try:
            job_role_group = JobRoleGroup.objects.get(pk=pk)
            job_role_group.job_role_group_type.delete()
            job_role_group.delete()
        except JobRoleGroup.DoesNotExist:
            pass
        return Response({}, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        major_job_roles_list = ["Exec Producer", "Line Producer", "Production Manager", "Production Coordinator"]
        job_role_group = JobRoleGroup.objects.get(pk=pk)
        job_roles_list = JobRole.objects.filter(job_role_group=job_role_group.pk).order_by("id")
        sub_results = []
        # if there is no job_roles for position then update the position
        # and if position has some job_roles then check if request role is not in major job roles
        if not job_roles_list:
            super(JobRoleGroupViewSet, self).partial_update(request=request, pk=pk)
        else:
            for job_role in job_roles_list:
                if job_role.job_role_type.title not in major_job_roles_list:
                    super(JobRoleGroupViewSet, self).partial_update(request=request, pk=pk)
                else:
                    return Response({"message": MAJOR_FOUR_ROLES_GROUP_DELETE_MESSAGE},
                                    status=status.HTTP_403_FORBIDDEN)
                job_role_dict = model_to_dict(job_role)
                job_role_dict["job_role_type"] = model_to_dict(job_role.job_role_type)
                sub_results.append(job_role_dict)
        job_role_group = JobRoleGroup.objects.get(pk=pk)
        job_role_group_dict = model_to_dict(job_role_group)
        job_role_group_dict["job_role_group_type"] = model_to_dict(job_role_group.job_role_group_type)
        job_role_group_dict["job_roles_list"] = sub_results
        return Response(job_role_group_dict, status=status.HTTP_200_OK)


class JobRoleViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = JobRole.objects.all()
    serializer_class = JobRoleSerializer
    major_job_roles_list = ["Exec Producer", "Line Producer", "Production Manager", "Production Coordinator"]

    def destroy(self, request, pk=None):
        try:
            job_role = JobRole.objects.get(pk=pk)
            if job_role.job_role_type.title not in self.major_job_roles_list:
                job_role.job_role_type.delete()
                job_role.delete()
            else:
                return Response({"message": MAJOR_FOUR_ROLES_DELETE_MESSAGE}, status=status.HTTP_403_FORBIDDEN)
        except JobRole.DoesNotExist:
            pass
        return Response({}, status=status.HTTP_200_OK)


class LocationEntityList(generics.ListAPIView):
    permission_classes = (AllowAny,)

    def list(self, request):
        """
        This view should return a list of all cities and states in the United States
        """
        states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
                  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
                  "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
                  "WI", "WY"]
        cities = ["New York", "Los Angeles", "Chicago", "Miami", "Dallas", "Philadelphia",
                  "Houston", "Atlanta", "Washington", "Boston", "Phoenix", "Seattle", "San Francisco",
                  "Detroit", "San Diego", "Minneapolis", "Tampa", "Denver", "Brooklyn", "Queens", "Riverside",
                  "Baltimore", "Las Vegas", "Portland", "San Antonio", "St.Louis", "Sacramento", "Orlando",
                  "San Jose", "Cleveland", "Pittsburgh", "Austin", "Cincinnati", "Kansas City", "Manhattan",
                  "Indianapolis", "Columbus", "Charlotte", "Virginia Beach", "Bronx", "Milwaukee", "Providence",
                  "Jacksonville", "Salt Lake City", "Nashville", "Richmond", "Memphis", "Raleigh", "New Orleans",
                  "Louisville"]
        return Response({"state": states, "city": cities})


class JobViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Job.objects.all()
    serializer_class = JobReadSerializer

    def list(self, request, company_id=None):
        company = Company.objects.get(pk=company_id)
        results, can_view = _get_contractor_all_jobs_in_company(company, request.user)
        if can_view:
            job_status = request.query_params.get("status")
            if job_status:
                job_status = job_status.upper()
                results = [result for result in results if result.status in job_status and not result.is_archived]
            else:
                results = [result for result in results if not result.is_archived]
            return Response(JobGallerySerializer(results, many=True).data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)

    def archive_list(self, request, company_id=None):
        company = Company.objects.get(pk=company_id)
        results, can_view = _get_contractor_all_jobs_in_company(company, request.user)
        if can_view:
            results = [result for result in results if result.is_archived]
            return Response(JobGalleryArchiveSerializer(results, many=True).data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)

    def _load_benji_default_job_roles(self, job):
        company = job.company
        root = os.path.join("apps/jobs/management/commands/db/init/benji")
        js_name = os.path.join(root, "company.json")
        with open(js_name, "r") as f:
            js_contents = json.load(f)
        job_super_roles = {"Exec Producer": None, "Director": None, "Line Producer": None}
        order = 1
        for group_type in js_contents["job_role_in_group"]:
            job_role_group_type, created = JobRoleGroupType.objects.get_or_create(
                company=company,
                title=group_type,
                job=job,
            )
            job_role_group = JobRoleGroup(job_role_group_type=job_role_group_type, job=job, order=order)
            job_role_group.save()
            order += 1
            role_types_list = js_contents["job_role_in_group"][group_type]
            for role_type in role_types_list:
                job_role_type, created = JobRoleType.objects.get_or_create(
                    company=company,
                    title=role_type,
                    job=job,
                )
                job_role = JobRole(job_role_type=job_role_type, job_role_group=job_role_group)
                job_role.save()
                if role_type == BAND_LEADER:
                    job_super_roles[EXECUTIVE_PRODUCER] = job_role.pk
                elif role_type == SECOND_BAND_LEADER:
                    job_super_roles[DIRECTOR] = job_role.pk
                elif role_type == THIRD_BAND_LEADER:
                    job_super_roles[LINE_PRODUCER] = job_role.pk
                # if role_type in [EXECUTIVE_PRODUCER, DIRECTOR, LINE_PRODUCER, PRODUCTION_MANAGER,
                #                  PRODUCTION_COORDINATOR]:
                #     job_super_roles[role_type] = job_role.pk
        return job_super_roles

    def _initialize_job_role_ids(self, job, job_super_roles):  # noqa
        job_role_id, created = JobRoleId.objects.get_or_create(job=job)
        try:
            job_role_id.exec_producer_id = job_super_roles[EXECUTIVE_PRODUCER]
        except KeyError:
            pass
        try:
            job_role_id.line_producer_id = job_super_roles[LINE_PRODUCER]
        except KeyError:
            pass
        try:
            job_role_id.director_id = job_super_roles[DIRECTOR]
        except KeyError:
            pass
        try:
            job_role_id.production_manager_id = job_super_roles[PRODUCTION_MANAGER]
        except KeyError:
            pass
        try:
            job_role_id.production_coordinator_id = job_super_roles[PRODUCTION_COORDINATOR]
        except KeyError:
            pass
        job_role_id.save()
        job_role_group_id, created = JobRoleGroupId.objects.get_or_create(job=job)
        try:
            job_role_group = JobRoleGroup.objects.get(job=job, job_role_group_type__title=TALENT)
            job_role_group_id.talent_id = job_role_group.pk
        except JobRoleGroup.DoesNotExist:
            pass
        job_role_group_id.save()

    def _initialize_job(self, job, job_super_roles):  # noqa
        staffs = []
        if not job_super_roles[EXECUTIVE_PRODUCER]:
            job.exec_producer = None
            job.exec_producer_name = ""
        if not job_super_roles[DIRECTOR]:
            job.director = None
            job.director_name = ""
        if not job_super_roles[LINE_PRODUCER]:
            job.line_producer = None
            job.line_producer_name = ""
        job.save()
        company = job.company
        exec_producer = job.exec_producer
        if isinstance(exec_producer, BenjiAccount):
            if (get_account_company_relationship(company, exec_producer) in
                    ACCOUNT_COMPANY_OWN_RELATIONS):
                staffs.append({"account": exec_producer, "type": EXECUTIVE_PRODUCER})
            else:
                pc_benji_account_entry, created = CompanyBenjiAccountEntry.objects.get_or_create(
                    company=company, benji_account=exec_producer)
                if created:
                    pc_benji_account_entry.relationship = ACCOUNT_COMPANY_RELATION_CONTRACTOR
                pc_benji_account_entry.save()
            create_virtual_memo_with_benji_account(exec_producer, job_super_roles[EXECUTIVE_PRODUCER])
        else:
            create_virtual_memo_with_full_name(job.exec_producer_name, job_super_roles[EXECUTIVE_PRODUCER])
        director = job.director
        if isinstance(director, BenjiAccount):
            if (get_account_company_relationship(company, director) in
                    ACCOUNT_COMPANY_OWN_RELATIONS):
                staffs.append({"account": director, "type": DIRECTOR})
            else:
                pc_benji_account_entry, created = CompanyBenjiAccountEntry.objects.get_or_create(
                    company=company, benji_account=director)
                if created:
                    pc_benji_account_entry.relationship = ACCOUNT_COMPANY_RELATION_CONTRACTOR
                pc_benji_account_entry.save()
            create_virtual_memo_with_benji_account(director, job_super_roles[DIRECTOR])
        else:
            create_virtual_memo_with_full_name(job.director_name, job_super_roles[DIRECTOR])
        line_producer = job.line_producer
        if isinstance(line_producer, BenjiAccount):
            if (get_account_company_relationship(company, line_producer) in
                    ACCOUNT_COMPANY_OWN_RELATIONS):
                staffs.append({"account": line_producer, "type": LINE_PRODUCER})
            else:
                pc_benji_account_entry, created = CompanyBenjiAccountEntry.objects.get_or_create(
                    company=company, benji_account=line_producer)
                if created:
                    pc_benji_account_entry.relationship = ACCOUNT_COMPANY_RELATION_CONTRACTOR
                pc_benji_account_entry.save()
            create_virtual_memo_with_benji_account(line_producer, job_super_roles[LINE_PRODUCER])
        else:
            create_virtual_memo_with_full_name(job.line_producer_name, job_super_roles[LINE_PRODUCER])
        index = 0
        for staff in staffs:
            CompanyDashboardJobRoles.objects.get_or_create(
                company=company,
                job_role=JobRole.objects.get(pk=job_super_roles[staff["type"]]),
            )
            index += 1

    def _initialize_job_settings(self, job):
        settings_js_name = "apps/jobs/settings/pre_production/settings.json"
        js_contents = {}
        with open(settings_js_name, "r") as f:
            js_contents = json.load(f)
        JobSettings(job=job, ppb_settings=js_contents).save()
        init_js_name = "apps/jobs/settings/pre_production/init.json"
        js_contents = {}
        with open(init_js_name, "r") as f:
            js_contents = json.load(f)
        PreProductionBook(job=job, data=js_contents).save()

    def create(self, request, company_id=None):  # noqa
        company = Company.objects.get(pk=company_id)
        add_field_in_request_data(request, "company", company.pk)
        job_serializer = JobWriteSerializer(data=request.data)
        exec_producer = request.data.get("exec_producer")
        director = request.data.get("director")
        try:
            if job_serializer.is_valid(raise_exception=True):
                job = job_serializer.save()
        except Exception:
            return Response("Gig with this Gig Name already exists",
                            status=status.HTTP_400_BAD_REQUEST)
        if exec_producer:
            try:
                exec_producer = BenjiAccount.objects.get(pk=exec_producer)
                set_contractor_relationship(exec_producer, company)
                job.exec_producer = exec_producer
            except (BenjiAccount.DoesNotExist, ValueError):
                job.exec_producer_name = exec_producer
        else:
            job.exec_producer_name = ""
        if director:
            try:
                director = BenjiAccount.objects.get(pk=request.data["director"])
                set_contractor_relationship(director, company)
                job.director = director
            except (BenjiAccount.DoesNotExist, ValueError):
                job.director_name = request.data.get("director", None)
        else:
            job.director_name = ""
        try:
            line_producer = BenjiAccount.objects.get(pk=request.data["line_producer"])
            set_contractor_relationship(line_producer, company)
            job.line_producer = line_producer
        except (BenjiAccount.DoesNotExist, ValueError):
            job.line_producer_name = request.data["line_producer"]
        except KeyError:
            job.line_producer_name = ""
        job.save()
        job_super_roles = self._load_benji_default_job_roles(job)
        self._initialize_job(job, job_super_roles)
        self._initialize_job_role_ids(job, job_super_roles)
        self._initialize_job_settings(job)
        return Response(self.serializer_class(instance=job).data,
                        status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return Response(f"Gig {pk} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        response_data = get_job_detail(job)
        return Response(response_data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):  # noqa
        if "original_status" in request.data and "status" in request.data:
            original_status = request.data["original_status"]
            new_status = request.data["status"]
            job = Job.objects.get(pk=pk)
            if original_status == JOB_STATUS_WRAPPED and new_status == JOB_STATUS_ACTIVE:
                return Response(CAN_NOT_MOVE_JOB_FROM_WRAPPED_TO_ACTIVE, status=status.HTTP_400_BAD_REQUEST)

            if original_status == JOB_STATUS_WRAPPED and new_status == JOB_STATUS_PENDING:
                return Response(CAN_NOT_MOVE_JOB_FROM_WRAPPED_TO_HOLD, status=status.HTTP_400_BAD_REQUEST)

            if original_status == JOB_STATUS_ACTIVE and new_status == JOB_STATUS_PENDING:
                return Response(CAN_NOT_MOVE_JOB_FROM_ACTIVE_TO_HOLD, status=status.HTTP_400_BAD_REQUEST)

            if original_status == JOB_STATUS_PENDING and new_status == JOB_STATUS_ACTIVE:
                if not can_activate_job(request.user, job):
                    return Response(CAN_NOT_ACTIVATE_JOB_MSG, status=status.HTTP_401_UNAUTHORIZED)
                # Delete all declined HOLD memos
                JobMemo.objects.filter(memo_type=HOLD_MEMO,
                                       decline=True,
                                       job_role__job_role_group__job=job).delete()
                # Convert all accepted HOLD memos to DEAL memos (with Memo Saved status)
                job_memos = JobMemo.objects.filter(memo_type=HOLD_MEMO,
                                                   accepted=True,
                                                   job_role__job_role_group__job=job)
                job_memos = JobMemo.objects.filter(job_role__job_role_group__job=job,
                                                   memo_type=HOLD_MEMO)
                for job_memo in job_memos:
                    old_memo_id = job_memo.id
                    old_memo = JobMemo.objects.get(pk=old_memo_id)
                    if not job_memo.decline and job_memo.accepted:
                        job_memo.pk = None
                        job_memo.memo_type = DEAL_MEMO
                        job_memo.accepted = False
                        job_memo.booked = False
                        job_memo.save()
                        job_memo_shoot_dates = JobMemoShootDate.objects.filter(job_memo=old_memo)
                        job_memo_rates = JobMemoRate.objects.filter(job_memo=old_memo)
                        for job_memo_rate in job_memo_rates:
                            job_memo_rate.job_memo = job_memo
                            job_memo_rate.save()
                        for job_memo_shoot_date in job_memo_shoot_dates:
                            job_memo_shoot_date.pk = None
                            job_memo_shoot_date.job_memo = job_memo
                            job_memo_shoot_date.save()
                        call_sheet_job_memos = CallSheetJobMemo.objects.filter(job_memo=old_memo)
                        for call_sheet_job_memo in call_sheet_job_memos:
                            call_sheet_job_memo.pk = None
                            call_sheet_job_memo.job_memo = job_memo
                            call_sheet_job_memo.save()
                        job_memo_attachments = JobMemoAttachment.objects.filter(job_memo=old_memo)
                        for job_memo_attachment in job_memo_attachments:
                            job_memo_attachment.pk = None
                            job_memo_attachment.job_memo = job_memo
                            job_memo_attachment.save()
                # Remove relationship between Schedule and User
                # But keeps pre-production event
                UserSchedule.objects.filter(schedule__job=job).delete()

        if "shoot_dates" in request.data:
            shoot_dates = request.data["shoot_dates"]
            if len(shoot_dates) > 0:
                JobShootDate.objects.filter(job=Job.objects.get(pk=pk)).delete()
                for shoot_date in shoot_dates:
                    shoot_date = datetime.datetime.strptime(shoot_date, "%Y-%m-%d").date()
                    try:
                        JobShootDate.objects.get(job=Job.objects.get(pk=pk), date=shoot_date)
                    except JobShootDate.DoesNotExist:
                        JobShootDate(job=Job.objects.get(pk=pk), date=shoot_date).save()
            if not len(shoot_dates):
                JobShootDate.objects.filter(job=Job.objects.get(pk=pk)).delete()
        if "rates" in request.data and "memo_id" in request.data:
            memo_id = int(request.data["memo_id"])
            memo = JobMemo.objects.get(pk=id)
            set_rates(memo, request)
        super(JobViewSet, self).partial_update(request=request, pk=pk)
        job = Job.objects.get(pk=pk)
        response_data = get_job_detail(job)
        return Response(response_data, status=status.HTTP_200_OK)

    def reinstate_job(self, request, company_id):
        job_ids = request.data.get('jobs', [])
        reinstate = request.data.get('reinstate')

        if job_ids and reinstate:
            for job in job_ids:
                job_obj = Job.objects.get(pk=job["id"])

                job_memo = JobMemo.objects.filter(job=job["id"])

                job_obj.pk = None
                job["company"] = company_id
                job_serializer = JobWriteSerializer(data=job)
                try:
                    if job_serializer.is_valid(raise_exception=True):
                        job_obj.job_number = job['job_number']
                        job_obj.title = job['title']
                        job_obj.client = job['client']
                        job_obj.start_date = job['start_date']
                        job_obj.wrap_date = job['wrap_date']
                        job_obj.status = reinstate
                        job_obj.is_archived = False

                        job_obj.save()

                        job_super_roles = self._load_benji_default_job_roles(job_obj)
                        self._initialize_job(job_obj, job_super_roles)
                        self._initialize_job_role_ids(job_obj, job_super_roles)
                        self._initialize_job_settings(job_obj)

                except Exception:
                    return Response("Gig with this Gig Name already exists",
                                    status=status.HTTP_400_BAD_REQUEST)

                for job_m in job_memo:
                    job_role = JobRole.objects.get(job_role_group__job=job_obj,
                                                   job_role_type__title=job_m.job_role.job_role_type.title,
                                                   job_role_type__company=job_obj.company,
                                                   )
                    VirtualMemo.objects.create(job_role=job_role, choice_level=job_m.choice_level,
                                               full_name=job_m.full_name, benji_account=job_m.benji_account)

        return Response({"Success": True}, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        return super(JobViewSet, self).destroy(request=request, pk=pk)

    def job_delete(self, request):
        job = request.data.get('job')
        Job.objects.filter(pk=job).delete()
        return Response({"Success": True}, status=status.HTTP_204_NO_CONTENT)

    def bulk_delete(self, request):
        job_ids = request.data.get('jobs', [])
        Job.objects.filter(pk__in=job_ids).delete()
        return Response({"Success": True}, status=status.HTTP_204_NO_CONTENT)

    def job_role_group_dnd(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        origin = request.data["origin"]
        destination = request.data["destination"]
        step = -1 if origin > destination else 1
        job_role_group = JobRoleGroup.objects.get(job=job, order=origin)
        job_role_group.order = 0
        job_role_group.save()
        for i in range(origin, destination, step):
            job_role_group = JobRoleGroup.objects.get(job=job, order=i + step)
            job_role_group.order = i
            job_role_group.save()
        job_role_group = JobRoleGroup.objects.get(job=job, order=0)
        job_role_group.order = destination
        job_role_group.save()
        results = retrieve_all_departments(job_id)
        return Response(results, status=status.HTTP_200_OK)

    def retrieve_schedule_and_shoot_note(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        start_date = request.GET["start_date"]
        end_date = request.GET["end_date"]
        events = request.GET["events"]
        shoot_days = request.GET["shoot_days"]
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
        schedules = Schedule.objects.filter(event__job_id=job_id,
                                            event__title__in=events.split(","),
                                            date__range=[start_date, end_date]).order_by("date", "time")
        shoot_notes = ShootNote.objects.filter(job_id=job_id,
                                               date__range=[start_date, end_date],
                                               date__in=shoot_days.split(","))
        response_data = {}
        response_data["schedules"] = ScheduleReadSerializer(schedules, many=True).data
        response_data["shoot_notes"] = ShootNoteReadSerializer(shoot_notes, many=True).data
        return Response(response_data, status=status.HTTP_200_OK)

    def save_crew_template(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
            company = job.company
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        name = request.data["name"]
        template = {}
        job_role_groups = JobRoleGroup.objects.filter(job=job, selected=True).order_by("order")
        for job_role_group in job_role_groups:
            template[job_role_group.job_role_group_type.title] = []
            job_roles = JobRole.objects.filter(job_role_group=job_role_group)
            for job_role in job_roles:
                template[job_role_group.job_role_group_type.title].append(job_role.job_role_type.title)
        crew_template = CrewTemplate(name=name, template=template, company=company)
        crew_template.save()
        return Response(CrewTemplateSerializer(instance=crew_template).data, status=status.HTTP_200_OK)

    def can_load_template(self, request, job_id=None, template_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        if not template_id:
            raise NotImplementedError("This API doesn't support execution missing crew template id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        virtual_memos = VirtualMemo.objects.filter(job_role__job_role_group__job=job)
        job_memos = JobMemo.objects.filter(job_role__job_role_group__job=job)
        crew_template = CrewTemplate.objects.get(pk=template_id)
        template = crew_template.template
        missing_job_roles = []
        for virtual_memo in virtual_memos:
            if not job_role_exists_in_the_template(virtual_memo.job_role, template):
                missing_job_roles.append({
                    "id": virtual_memo.job_role.pk,
                    "title": virtual_memo.job_role.job_role_type.title,
                })
        for job_memo in job_memos:
            if not job_role_exists_in_the_template(job_memo.job_role, template):
                missing_job_roles.append({"id": job_memo.job_role.pk, "title": job_memo.job_role.job_role_type.title})
        res_list = []
        for i in range(len(missing_job_roles)):
            if missing_job_roles[i] not in missing_job_roles[i + 1:]:
                res_list.append(missing_job_roles[i])
        return Response({"missing_job_roles": res_list}, status=status.HTTP_200_OK)

    def load_crew_template(self, request, job_id=None, template_id=None):  # noqa
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        if not template_id:
            raise NotImplementedError("This API doesn't support execution missing crew template id.")
        try:
            job = Job.objects.get(pk=job_id)
            company = job.company
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        try:
            missing_job_roles = request.data["missing_job_roles"]
        except KeyError:
            missing_job_roles = []
        crew_template = CrewTemplate.objects.get(pk=template_id)
        template = crew_template.template
        job_super_roles = {"Exec Producer": None, "Director": None, "Line Producer": None,
                           "Production Manager": None, "Production Coordinator": None}
        job_role_groups = JobRoleGroup.objects.filter(job=job).order_by("order")
        for job_role_group in job_role_groups:
            all_job_role_removed = True
            job_roles = JobRole.objects.filter(job_role_group=job_role_group)
            for job_role in job_roles:
                if job_role.job_role_type.title in [EXECUTIVE_PRODUCER, DIRECTOR, LINE_PRODUCER, PRODUCTION_MANAGER,
                                                    PRODUCTION_COORDINATOR]:
                    job_super_roles[job_role.job_role_type.title] = job_role.pk
                virtual_memo = VirtualMemo.objects.filter(job_role=job_role)
                job_memo = JobMemo.objects.filter(job_role=job_role)
                if job_role_exists_in_the_template(job_role, template):
                    all_job_role_removed = False
                    continue
                if not job_memo and not virtual_memo:
                    job_role.delete()
                elif job_role.pk not in missing_job_roles:
                    job_role.delete()
                else:
                    all_job_role_removed = False
            if all_job_role_removed:
                job_role_group.delete()
        order = 1
        for group_type in template:
            job_role_group_type, created = JobRoleGroupType.objects.get_or_create(
                company=company,
                title=group_type,
                job=job,
            )
            job_role_group, created = JobRoleGroup.objects.get_or_create(
                job_role_group_type=job_role_group_type,
                job=job,
            )
            job_role_group.order = order
            job_role_group.save()
            order += 1
            role_types_list = template[group_type]
            for role_type in role_types_list:
                job_role_type, created = JobRoleType.objects.get_or_create(
                    company=company,
                    title=role_type,
                    job=job,
                )
                job_role, created = JobRole.objects.get_or_create(
                    job_role_type=job_role_type,
                    job_role_group=job_role_group,
                )
                if role_type in [EXECUTIVE_PRODUCER, DIRECTOR, LINE_PRODUCER, PRODUCTION_MANAGER,
                                 PRODUCTION_COORDINATOR]:
                    job_super_roles[role_type] = job_role.pk
        self._initialize_job(job, job_super_roles)
        self._initialize_job_role_ids(job, job_super_roles)
        results = retrieve_all_departments(job_id)
        return Response(results, status=status.HTTP_200_OK)

    def archive_job_download(self, request):
        job_ids = request.data.get('jobs', [])
        tmpdirname = mkdtemp()
        temp_name = next(tempfile._get_candidate_names())
        temp_zip_file_name = f"/tmp/jobs_{temp_name}.zip"
        jobs = Job.objects.filter(pk__in=job_ids)
        for job in jobs:
            crew = []
            job_data = JobReadSerializer(instance=job).data
            job_memos = JobMemo.objects.filter(job=job)
            for job_memo in job_memos:
                data = JobMemoSerializer(instance=job_memo).data
                data["total_price"] = job_memo.get_total_price
                data["position"] = job_memo.job_role.job_role_type.title
                crew.append(data)
            job_data["job_memos"] = crew
            job_data['company'] = CompanySerializer(instance=job.company).data
            job_data["shoot_date"] = JobShootDate.objects.filter(job=job).values_list('date', flat=True)
            job_memo_total = JobMemoSerializer(instance=job_memos, many=True).data
            job_data["crew_amount"] = sum(d.get('total_price', 0) for d in job_memo_total)
            file_name = f"job_{job.title}_{job.job_number}.pdf"
            file_data = Render.render_to_string("report_template.html",
                                                {"invoice": job_data, "crew": job_data["job_memos"]})
            with open(f"{tmpdirname}/{file_name}", "wb") as fh:
                fh.write(file_data)
        if zip:
            dump_files_in_dir_to_zip(tmpdirname, temp_zip_file_name)
        with open(f"{temp_zip_file_name}.zip", "rb") as f:
            response = HttpResponse(f.read())
            response['Content-Type'] = 'application/x-zip-compressed'
            response['Content-Disposition'] = 'attachment; filename=jobs.zip'
        return response

    def get_crew_templates(self, request, job_id=None):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
            company = job.company
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        crew_templates = CrewTemplate.objects.filter(company=company)
        return Response(CrewTemplateSerializer(crew_templates, many=True).data, status=status.HTTP_200_OK)


class JobDocumentsViewSet(viewsets.ViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Job.objects.all()

    def list(self, request, pk):
        job = Job.job_number
        pass

    def download_all_w9_as_zip(self, request, pk):
        zipfilename = get_w9_documents_for_job(pk)
        with open(f"{zipfilename}.zip", "rb") as f:
            response = HttpResponse(f.read())
            response['Content-Type'] = 'application/x-zip-compressed'
            response['Content-Disposition'] = 'attachment; filename=w9s.zip'
        return response

    def download_all_invoice_as_zip(self, request, pk):
        invoice_memo_ids = request.data.get('invoice_memo_ids', [])
        zipfilename = get_invoice_documents_for_job(pk, invoice_memo_ids=invoice_memo_ids)
        with open(f"{zipfilename}.zip", "rb") as f:
            response = HttpResponse(f.read())
            response['Content-Type'] = 'application/x-zip-compressed'
            response['Content-Disposition'] = 'attachment; filename=invoices.zip'
        return response

    def download_all_docs_as_zip(self, request, pk):
        zipfilename = get_all_documents_for_job_zipped(pk)
        with open(f"{zipfilename}.zip", "rb") as f:
            response = HttpResponse(f.read())
            response['Content-Type'] = 'application/x-zip-compressed'
            response['Content-Disposition'] = 'attachment; filename=job_invoices_and_w9s.zip'
        return response

    def download_w9list_as_zip(self, request, pk):
        doc_ids = request.data["doc_ids"]
        zipfilename = get_w9list_documents_for_job(pk, doc_ids)
        with open(f"{zipfilename}.zip", "rb") as f:
            response = HttpResponse(f.read())
            response['Content-Type'] = 'application/x-zip-compressed'
            response['Content-Disposition'] = 'attachment; filename=w9s.zip'
        return response

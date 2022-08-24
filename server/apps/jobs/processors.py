from apps.jobs.models import BenjiAccount, Company, JobMemo, JobRole, JobRoleGroupType, JobRoleType, Location
from apps.user.models import CompanyBenjiAccountEntry


def process_registration_data(company_data, accounts):
    company = company_data.get("company")
    company = Company(**company)
    company.save()
    for group_type in company_data.get("job_role_in_group"):
        JobRoleGroupType(title=group_type, description=group_type, company=company).save()
        role_types_list = company_data["job_role_in_group"][group_type]
        for role_type in role_types_list:
            JobRoleType(title=role_type, description=role_type, company=company).save()
    for benji_account in accounts:
        company_relationship = benji_account.pop("company_relationship")
        password = benji_account.pop("password")
        benji_account = BenjiAccount(**benji_account)
        benji_account.set_password(password)
        benji_account.save()
        CompanyBenjiAccountEntry(company=company,
                                 benji_account=benji_account,
                                 relationship=company_relationship).save()


def process_job_memo_data(job_memos):
    for job_memo in job_memos:
        job_memo = JobMemo(memo_type=job_memo["memo_type"],
                           benji_account=BenjiAccount.objects.get(pk=job_memo["benji_account"]),
                           job_role=JobRole.objects.get(pk=job_memo["job_role"]),
                           location=Location.objects.get(pk=job_memo["location"]),
                           daily_rate=job_memo["daily_rate"],
                           daily_hours=job_memo["daily_hours"],
                           notes=job_memo["notes"],
                           acceptance_level=job_memo["acceptance_level"],
                           choice_level=job_memo["choice_level"],
                           booked=job_memo["booked"])
        job_memo.save()

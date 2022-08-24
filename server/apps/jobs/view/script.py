from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.models import Job, JobScript, PreProductionBook, Script
from apps.jobs.serializers import JobScriptReadSerializer


def add_board_script_to_ppb(job_script):
    ppb = PreProductionBook.objects.get(job=job_script.job)
    ppb_data = ppb.data
    script = {"job_script_id": job_script.id, "document": ""}
    try:
        ppb_data["Pages"]["Boards/Scripts"]["scripts"].append(script)
    except KeyError:
        ppb_data["Pages"]["Boards/Scripts"]["scripts"] = []
        ppb_data["Pages"]["Boards/Scripts"]["scripts"].append(script)
    ppb.data = ppb_data
    ppb.save()


def remove_board_script_from_ppb(job_script):
    ppb = PreProductionBook.objects.get(job=job_script.job)
    ppb_data = ppb.data
    scripts = ppb_data["Pages"]["Boards/Scripts"]["scripts"]
    for i in range(len(scripts)):
        if scripts[i]["job_script_id"] == job_script.id:
            del scripts[i]
            break
    ppb.data = ppb_data
    ppb.save()


class JobScriptViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = JobScript.objects.all()
    serializer_class = JobScriptReadSerializer

    def list(self, request, job_id=None):
        job = Job.objects.get(pk=job_id)
        job_scripts = JobScript.objects.filter(job=job)
        return Response(self.serializer_class(job_scripts, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        document = request.data["document"]
        script = Script(document=document)
        script.save()
        job_script, created = JobScript.objects.get_or_create(job=job, script=script)
        add_board_script_to_ppb(job_script)
        return Response(self.serializer_class(instance=job_script).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobScriptViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(JobScriptViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        job_script = JobScript.objects.get(pk=pk)
        remove_board_script_from_ppb(job_script)
        return super(JobScriptViewSet, self).destroy(request=request, pk=pk)

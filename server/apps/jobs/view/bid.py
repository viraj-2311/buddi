from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.models import Job, JobBid
from apps.jobs.serializers import JobBidReadSerializer


class JobBidViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = JobBid.objects.all()
    serializer_class = JobBidReadSerializer

    def list(self, request, job_id=None):
        job = Job.objects.get(pk=job_id)
        job_bid = JobBid.objects.filter(job=job).first()
        return Response(self.serializer_class(instance=job_bid).data, status=status.HTTP_200_OK)

    def create(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        document = request.data["document"]
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        job_bid, created = JobBid.objects.get_or_create(job=job, document=document)
        return Response(JobBidReadSerializer(instance=job_bid).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobBidViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(JobBidViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(JobBidViewSet, self).destroy(request=request, pk=pk)

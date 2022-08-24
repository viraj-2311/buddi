from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.jobs.models import Document, Job, JobDocument
from apps.jobs.serializers import DocumentSerializer


class JobDocumentViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def list(self, request, job_id=None):
        job = Job.objects.get(pk=job_id)
        document_ids = JobDocument.objects.filter(job=job).values_list("document", flat=True)
        results = Document.objects.filter(pk__in=document_ids).order_by("pk")
        return Response(self.serializer_class(results, many=True).data, status=status.HTTP_200_OK)

    def create(self, request, job_id):
        if not job_id:
            raise NotImplementedError("This API doesn't support execution missing gig id.")
        try:
            job = Job.objects.get(pk=job_id)
        except Job.DoesNotExist:
            return Response(f"Gig {job_id} does not exist.", status=status.HTTP_400_BAD_REQUEST)
        document_serializer = self.serializer_class(data=request.data)
        if document_serializer.is_valid(raise_exception=True):
            document = document_serializer.save()
        job_document, created = JobDocument.objects.get_or_create(job=job, document=document)
        return Response(self.serializer_class(instance=document).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        return super(JobDocumentViewSet, self).retrieve(request=request, pk=pk)

    def partial_update(self, request, pk=None):
        return super(JobDocumentViewSet, self).partial_update(request=request, pk=pk)

    def destroy(self, request, pk=None):
        return super(JobDocumentViewSet, self).destroy(request=request, pk=pk)

from django.db import models

from apps.user.models import BenjiAccount, Company


class CompanyNetwork(models.Model):
    # Deprecated, Use SocialNetwork instead
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    invitor = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="company_network_invitor")
    invitee = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="company_network_invitee")
    accepted = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)
    notes = models.CharField(max_length=500, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "company_network"
        unique_together = (("invitor", "invitee", "company"),)


class Favorites(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    poster = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="company_network_poster")
    friend = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="company_network_friend")

    class Meta:
        db_table = "company_network_favorites"

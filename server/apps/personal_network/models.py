from django.db import models

from apps.user.models import BenjiAccount, Company


class SocialNetwork(models.Model):
    invitor = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="social_network_invitor",
        null=True,
    )
    invitor_company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="social_network_invitor",
        null=True,
    )
    invitee = models.ForeignKey(
        BenjiAccount,
        on_delete=models.CASCADE,
        related_name="social_network_invitee",
        null=True,
    )
    invitee_company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="social_network_invitee",
        null=True,
    )
    accepted = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)
    notes = models.CharField(max_length=500, blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    show_company = models.BooleanField(default=False)

    class Meta:
        db_table = "personal_network"
        unique_together = (
            ("invitor", "invitee"),
            ("invitor", "invitee_company"),
            ("invitor_company", "invitee"),
            ("invitor_company", "invitee_company"),
        )

    @property
    def invitor_obj(self):
        return self.invitor_company or self.invitor

    @property
    def invitee_obj(self):
        return self.invitee_company or self.invitee


class Favorites(models.Model):
    poster = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="personal_network_poster")
    friend = models.ForeignKey(BenjiAccount, on_delete=models.CASCADE, related_name="personal_network_friend")

    class Meta:
        db_table = "personal_network_favorites"

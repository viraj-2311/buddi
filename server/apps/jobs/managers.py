from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    """Custom User Manager for the `BenjiAccount` object.
    Uses email as an identifier instead of username.
    """
    def create_user(self, email, password, **args):
        if not email:
            raise ValueError("An email is required to create a user.")
        email = self.normalize_email(email)
        user = self.model(email=email, **args)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **args):
        # Set relevant function arguments if they were not provided
        args.setdefault("is_staff", True)
        args.setdefault("is_superuser", True)
        args.setdefault("is_active", True)
        # Validate provided arguments
        if not args["is_staff"]:
            raise ValueError("Superusers must have is_staff=True.")
        if not args["is_superuser"]:
            raise ValueError("Superusers must have is_superuser=True.")
        return self.create_user(email, password, **args)

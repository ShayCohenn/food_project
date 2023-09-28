from django.utils import timezone
from users.models import UserVerification

# Remove expired verify codes
def delete_expired_user_verifications():
    expired_verifications = UserVerification.objects.filter(expiration_time__lt=timezone.now())
    expired_verifications.delete()
    print("scanning for expired tokens...")
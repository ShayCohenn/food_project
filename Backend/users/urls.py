from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', views.refresh_access_token),
    path('register/', views.UserRegistrationView.as_view()),
    path('user/<str:username>/', views.UserSpecificView.as_view()),
    path('profile/<str:username>/', views.GetUserData.as_view()),
    path('follow/<str:follower_username>/<str:following_username>/', views.FollowView.as_view()),
    path('search', views.SearchUsers.as_view()),
    path('email/', views.VerifyEmailView.as_view()),
    path('password-reset/email/', views.ForgotPasswordView.as_view()),
    path('password-reset/', views.ForgotPassword.as_view()),
]

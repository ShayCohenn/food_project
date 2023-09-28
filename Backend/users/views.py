from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.decorators import APIView,api_view,authentication_classes, parser_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from recipes.models import Recipe 
from recipes.serializers import RecipeSerializer
from users.models import ForgotPasswodVerify, UserProperties, UserVerification, Follow
from .serializers import FollowSerializer, RegisterUserSerializer, UserPropertiesSerializer, UserSerializer, MyTokenObtainPairSerializer, VerifyEmailSerializer
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from random import randint
from django.utils import timezone

User = get_user_model()

# ------------------------------------------ Verify The Email Sent By The User -----------------------------------------------------

class VerifyEmailView(APIView):
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            
            if User.objects.filter(username = username).exists():
                return Response({"message": "Username already registered"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if the email already exists in the database
            if User.objects.filter(email=email).exists() or UserVerification.objects.filter(email = email):
                return Response({"message": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

            # Generate a random 6-digit verification code with leading zeros
            verification_code = "{:06}".format(randint(0, 999999))

            # Calculate the expiration time (e.g., 30 minutes from now)
            expiration_time = timezone.now() + timezone.timedelta(minutes=30)

            # Store the verification code along with the email in the UserVerification model
            UserVerification.objects.create(email=email, verification_code=verification_code, expiration_time=expiration_time)

            # Send an email response to the user with the verification code
            subject = "Email Verification"
            message = f"Click the button below to verify your email. Use this code: {verification_code}"
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [email]

            send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return Response({"message": "Email Sent Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        email = request.data.get("email")
        try:
            email_to_delete = UserVerification.objects.get(email=email)
            email_to_delete.delete()
            return Response({"message": "Email deleted successfully"}, status=status.HTTP_200_OK)
        except UserVerification.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------------------------- User Registration Method ---------------------------------------------

class UserRegistrationView(APIView):
    @transaction.atomic
    @parser_classes([JSONParser])  # Ensure JSON parsing for the request
    def post(self, request):
        try:
            verification_code = request.data.get('verification_code')
            user_verification = UserVerification.objects.get(verification_code=verification_code)
            stored_email = user_verification.email
            submitted_email = request.data.get('email')  # Get the email from the request data
            print(request.data)
            # Check if the submitted email matches the stored email
            if submitted_email != stored_email:
                return Response({"message": "Email does not match the token"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = RegisterUserSerializer(data=request.data)
            
            if serializer.is_valid():
                user = serializer.save()
                user.save()

                properties_serializer = UserPropertiesSerializer(data=request.data)
                if properties_serializer.is_valid():
                    user_properties = properties_serializer.save()
                    user_properties.user = user
                    user_properties.save()
                else:
                    raise serializers.ValidationError(properties_serializer.errors)

                # Delete the UserVerification entry to prevent re-use of the token
                user_verification.delete()

                return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

        except UserVerification.DoesNotExist:
            return Response({"message": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#  ------------------------------------------------ User Views - GET, PUT, DELETE For Authenticated Users ----------------------------------------------------

@authentication_classes([JWTAuthentication])
class UserSpecificView(APIView):
    def delete(self, request, id):
        user = get_object_or_404(User, id=id)
        
        # Check if the authenticated user is the same as the user being deleted
        if user != request.user:
            return Response({"error": "You are not authorized to delete this user."}, status=status.HTTP_403_FORBIDDEN)
        user_properties = user.userproperties
        user_properties.delete()
        
        # Delete User instance
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    def put(self, request, username):
        user = get_object_or_404(User, username=username)
        if user != request.user:
            return Response({"error": "You are not authorized to edit this user."}, status=status.HTTP_403_FORBIDDEN)

        user_serializer = UserSerializer(instance=user, data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()

            # Update UserProperties
            user_properties = user.userproperties
            for field, value in request.data.items():
                if field == 'password':
                    user.set_password(value)  # Set new password securely
                else:
                    setattr(user_properties, field, value)
            user_properties.save()
            user.save()  # Save the updated user with new password

            return Response(user_serializer.data)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# --------------------------------------------------- Get User Data -------------------------------------------------------------------------
@authentication_classes([JWTAuthentication])
class GetUserData(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        user_recipes = Recipe.objects.filter(user_id=user)
        followers = Follow.objects.filter(following=user)
        followings = Follow.objects.filter(follower=user)
        
        # Create a list of dictionaries for followers and following data
        followers_data = [{"username": follower.follower.username, "profile_pic": follower.follower.userproperties.profile_pic} for follower in followers]
        followings_data = [{"username": following.following.username, "profile_pic": following.following.userproperties.profile_pic} for following in followings]
        
        isFollowing = False
        isFollowingYou = False
        
        if not request.user.is_anonymous:  # Check if the user is authenticated
            # Check if the currently authenticated user is following the user with the specified username
            if Follow.objects.filter(follower=request.user, following=user).exists():
                isFollowing = True
            if Follow.objects.filter(following=request.user, follower=user).exists():
                isFollowingYou = True
        
        # Case 1: Not the owner
        if request.user != user:
            limited_recipe_data = self.get_filtered_recipe_data(user_recipes)
            limited_data = {
                'isOwner': False,
                'username': user.username,
                'subscribed': user.userproperties.subscribed,
                'profile_pic': user.userproperties.profile_pic,
                'total_recipes': len(limited_recipe_data),
                'recipes': limited_recipe_data,
                'followers': followers_data,  # Include followers data as an array of objects
                'following': followings_data,  # Include following data as an array of objects
                'total_following': len(followings_data),
                'total_followers': len(followers_data),
                'isFollowing': isFollowing,
                'isFollowingYou': isFollowingYou,
            }
            
            return Response(limited_data)

        # Case 2: Authenticated (owner of the data)
        elif request.user == user:
            user_serializer = UserSerializer(instance=user)
            user_properties_serializer = UserPropertiesSerializer(instance=user.userproperties)
            limited_recipe_data = self.get_filtered_recipe_data(user_recipes)
            data = {
                'isOwner': True,
                'user': user_serializer.data,
                'user_properties': user_properties_serializer.data,
                'total_recipes': len(limited_recipe_data),
                'recipes': limited_recipe_data,
                'followers': followers_data,  # Include followers data as an array of objects
                'following': followings_data,  # Include following data as an array of objects
                'total_following': len(followings_data),
                'total_followers': len(followers_data)
            }
            return Response(data, status=status.HTTP_200_OK)
        
        return Response("user not found", status=status.HTTP_404_NOT_FOUND)

    def get_filtered_recipe_data(self, recipes):
        filtered_recipe_data = []
        for recipe in recipes:
            # Use the serializer to get the average rating
            average_rating = RecipeSerializer.get_average_rating(self, recipe)
            user_count = RecipeSerializer.get_user_count(self, recipe)
            filtered_recipe_data.append({
                "title": recipe.title,
                "average_rating": average_rating,
                "user_count": user_count,
                "thumbnail": recipe.thumbnail,
                # "cuisine": recipe.cuisine.,
                "tags": recipe.tags,
                "post_date": recipe.post_date,
                "uuid": recipe.uuid
            })
        return filtered_recipe_data




# -------------------------------------------------- User Follow ---------------------------------------------------------------------
@authentication_classes([JWTAuthentication])
class FollowView(APIView):
    # Create Follow
    def post(self, request, follower_username, following_username):
        follower = get_object_or_404(User, username = follower_username)
        following = get_object_or_404(User, username = following_username)
        if follower == following:
            return Response({"Error":"Can't follow yourself"})
        if request.user != follower:
            return Response("Not authorized to access this user")
        if following == None:
            return Response("This user doesnt exist")
        if Follow.objects.filter(follower=follower, following=following).exists():
            return Response("Already following this user", status=status.HTTP_400_BAD_REQUEST)
        
        # Create a Follow object
        follow_data = {
            'follower': follower.pk,
            'following': following.pk,
        }
        # Serialize and save the Follow object
        serializer = FollowSerializer(data=follow_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # Unfollow
    def delete(self, request, follower_username, following_username):
        follower = get_object_or_404(User, username = follower_username)
        following = get_object_or_404(User, username = following_username)
        if follower == following:
            return Response({"Error":"Can't unfollow yourself"})
        if request.user != follower:
            return Response("Not authorized to access this user")
        if following == None:
            return Response("This user doesnt exist")
        if Follow.objects.filter(follower=follower, following=following).exists():
            # Check if the follow relationship exists
            try:
                follow = Follow.objects.get(follower=follower, following=following)
            except Follow.DoesNotExist:
                return Response({"error": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)

            # Delete the follow relationship
            follow.delete()

            return Response({"message": "Unfollowed successfully."}, status=status.HTTP_204_NO_CONTENT)
        return Response("unfollow error", status=status.HTTP_400_BAD_REQUEST)
    
# ------------------------------------------- Get New Access Token Using The Refresh Token -----------------------------------------------

@api_view(['POST'])
def refresh_access_token(request):
    refresh_token = request.data.get('refresh_token')
    print(refresh_token)
    if refresh_token:
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({'access_token': access_token})
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=400)
    else:
        return Response({'error': 'Refresh token not provided'}, status=400)

# ---------------------------------------------- Get Refresh And Access Tokens -------------------------------------------------

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# --------------------------------------------------- Search Users ------------------------------------------------------
@authentication_classes([JWTAuthentication])
class SearchUsers(APIView):
    def get(self, request):
        query = request.query_params.get("q")

        if query:
            # Perform a case-insensitive partial match search on the username field
            users = User.objects.filter(username__icontains=query)

            # Serialize the matching users using your UserSerializer
            user_serializer = UserSerializer(users, many=True)  # Replace UserSerializer with your actual serializer

            # Fetch UserProperties for the matching users
            user_ids = users.values_list('id', flat=True)
            user_properties = UserProperties.objects.filter(user_id__in=user_ids)
            user_properties_serializer = UserPropertiesSerializer(user_properties, many=True)  # Replace with your actual serializer

            serialized_users = []
            
            for i in range(len(users)):
                user_data = user_serializer.data[i]
                user_properties_data = user_properties_serializer.data[i]
                
                # Fetch the number of followers for the current user
                followers_count = Follow.objects.filter(following=users[i]).count()
                
                # Fetch the number of users following the current user
                following_count = Follow.objects.filter(follower=users[i]).count()
                
                # Fetch the usernames of followers for the current user
                followers = Follow.objects.filter(following=users[i])
                follower_usernames = [follower.follower.username for follower in followers]
                
                # Fetch the usernames of users following the current user
                following = Follow.objects.filter(follower=users[i])
                following_usernames = [user.following.username for user in following]
                
                # Fetch the number of recipes for the current user
                recipes_count = Recipe.objects.filter(user_id=users[i]).count()
                
                user_data.update({
                    "followers_count": followers_count,
                    "following_count": following_count,
                    "follower_usernames": follower_usernames,
                    "following_usernames": following_usernames,
                    "recipes_count": recipes_count,
                })
                
                serialized_users.append({
                    "user": user_data,
                    "user_properties": user_properties_data,
                })

            return Response(serialized_users)

        # Handle the case when no query is provided
        return Response([],status=status.HTTP_200_OK)
#  ----------------------------------------------------- Forgot Password ------------------------------------------

class ForgotPasswordView(APIView):
    # Send email and create an object in the verify db
    def post(self, request):
        email = request.data.get("email")
        # Check if the email already exists in the database
        existing_entry = ForgotPasswodVerify.objects.filter(email=email).first()
        if existing_entry:
            # Delete the existing entry
            existing_entry.delete()

        # Generate a random 6-digit verification code with leading zeros
        verification_code = "{:06}".format(randint(0, 999999))

        # Calculate the expiration time (e.g., 30 minutes from now)
        expiration_time = timezone.now() + timezone.timedelta(minutes=30)

        # Store the verification code along with the email in the ForgotPasswordVerify model
        ForgotPasswodVerify.objects.create(email=email, verification_code=verification_code, expiration_time=expiration_time)

        # Send an email response to the user with the verification code
        subject = "Password Reset"
        message = f"To reset your password use this code: {verification_code}"
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]

        send_mail(subject, message, from_email, recipient_list, fail_silently=False)

        return Response({"message": "Email Sent Successfully"}, status=status.HTTP_200_OK)
    # Delete the object from the verify db for a resend
    def delete(self, request):
        email = request.data.get("email")
        try:
            email_to_delete = ForgotPasswodVerify.objects.get(email=email)
            email_to_delete.delete()
            return Response({"message": "Email deleted successfully"}, status=status.HTTP_200_OK)
        except ForgotPasswodVerify.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_400_BAD_REQUEST)
# ---------------------------------- Password Reset Functionality -----------------------------
class ForgotPassword(APIView):
    def post(self, request):
        email = request.data.get("email")
        verification_code = request.data.get("code")
        new_password = request.data.get("new_password")

        try:
            # Check if the email and verification code match
            verify_entry = ForgotPasswodVerify.objects.get(email=email, verification_code=verification_code)

            # Check if the verification code is still valid (not expired)
            if verify_entry.expiration_time >= timezone.now():
                # Reset the user's password
                user = User.objects.get(email=email)
                user.set_password(new_password)
                user.save()
                # Delete the verification entry
                verify_entry.delete()

                return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Verification code has expired"}, status=status.HTTP_400_BAD_REQUEST)

        except ForgotPasswodVerify.DoesNotExist:

            return Response({"error": "Email or verification code is invalid"}, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import get_user_model
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import APIView, authentication_classes,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from reviews.serializers import RecipeCommentSerializer, RecipeRatingSerializer
from reviews.models import RecipeComment, RecipeRating
from recipes.models import Recipe

User = get_user_model()

# -------------------------------------------------------------- Rate Recipe ------------------------------------------------

@authentication_classes([JWTAuthentication])
class RateRecipe(APIView):
    # Get rating for a recipe
    def get(self, request, recipe_id):
        # Get the recipe
        recipe = get_object_or_404(Recipe, uuid=recipe_id)

        # Get all the reviews for the recipe
        ratings = RecipeRating.objects.filter(recipe=recipe)

        # Serialize the reviews
        serializer = RecipeRatingSerializer(ratings, many=True)

        return Response(serializer.data)
    # Create the rating
    def post(self, request, recipe_id):
        # Get the authenticated user
        user = request.user
        rating_user = get_object_or_404(User, username = user)

        # Get the recipe 
        recipe = get_object_or_404(Recipe, uuid=recipe_id)

        if user.is_anonymous:
            return Response({"error": "You must be authenticated to rate a recipe."}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if the user has already rated this recipe
        existing_rating = RecipeRating.objects.filter(user=user, recipe=recipe).first()

        if existing_rating:
            rate = get_object_or_404(RecipeRating, recipe = recipe , user = rating_user)

            # Get the updated rating and review text from the request data
            updated_rating = request.data.get("rating")

            # Check if the rating is within the valid range (1 to 5)
            if updated_rating is not None and (updated_rating < 1 or updated_rating > 5):
                return Response({"error": "Rating must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

            # Update the review fields if new values are provided
            if updated_rating is not None:
                rate.rating = updated_rating

            # Set the was_edited field to True
            rate.was_edited = True

            # Save the updated review
            rate.save()

            return Response({"message": "Rating updated successfully."}, status=status.HTTP_200_OK)

        # Get the rating value from the request data
        rating = request.data.get("rating")

        # Check if the rating is within the valid range (1 to 5)
        if not 1 <= rating <= 5:
            return Response({"error": "Rating must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new rating entry
        RecipeRating.objects.create(user=user, recipe=recipe, rating=rating)

        return Response({"message": "Recipe rated successfully."}, status=status.HTTP_201_CREATED)

# ------------------------------------------------------------- Edit/Delete a specific rate -------------------------------------
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class RateSpecificView(APIView):
    def put(self, request, rate_id):
        # Get the review object by its ID
        rate = get_object_or_404(RecipeRating, id=rate_id)

        # Ensure that the user making the request is the owner of the review
        if request.user != rate.user:
            return Response({"error": "You are not authorized to edit this rate."}, status=status.HTTP_403_FORBIDDEN)

        # Get the updated rating and review text from the request data
        updated_rating = request.data.get("rating")

        # Check if the rating is within the valid range (1 to 5)
        if updated_rating is not None and (updated_rating < 1 or updated_rating > 5):
            return Response({"error": "Rating must be between 1 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the review fields if new values are provided
        if updated_rating is not None:
            rate.rating = updated_rating

        # Set the was_edited field to True
        rate.was_edited = True

        # Save the updated review
        rate.save()

        return Response({"message": "Rating updated successfully."}, status=status.HTTP_200_OK)

    def delete(self, request, rate_id):
        # Get the review object by its ID
        rate = get_object_or_404(RecipeRating, id=rate_id)

        # Ensure that the user making the request is the owner of the review
        if request.user != rate.user:
            return Response({"error": "You are not authorized to delete this Rating."}, status=status.HTTP_403_FORBIDDEN)

        # Delete the review
        rate.delete()

        return Response({"message": "Rating deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    # ----------------------------------------------------------------- Comments ----------------------------------------------------

@authentication_classes([JWTAuthentication])
class CommentRecipe(APIView):
    def get(self, request, recipe_id):
        # Get the recipe
        recipe = get_object_or_404(Recipe, uuid=recipe_id)

        # Get all the reviews for the recipe
        comments = RecipeComment.objects.filter(recipe=recipe)

        # Serialize the reviews
        serializer = RecipeCommentSerializer(comments, many=True)

        return Response(serializer.data)
    
    def post(self, request, recipe_id):
        # Get the authenticated user
        user = request.user

        # Get the recipe 
        recipe = get_object_or_404(Recipe, uuid=recipe_id)

        if user.is_anonymous:
            return Response({"error": "You must be authenticated to comment a recipe."}, status=status.HTTP_401_UNAUTHORIZED)

        # Get the rating value from the request data
        comment = request.data.get("comment")

        # Create a new rating entry
        RecipeComment.objects.create(user=user, recipe=recipe, comment=comment)

        return Response({"message": "Comment sent successfuly"}, status=status.HTTP_201_CREATED)

# --------------------------------------------------------- Edit and Delete a specific comment ------------------------------------------------

@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class CommentSpecificView(APIView):
    def put(self, request, comment_id):
        # Get the review object by its ID
        comment = get_object_or_404(RecipeComment, id=comment_id)

        # Ensure that the user making the request is the owner of the review
        if request.user != comment.user:
            return Response({"error": "You are not authorized to edit this comment."}, status=status.HTTP_403_FORBIDDEN)

        # Get the updated rating and review text from the request data
        updated_comment = request.data.get("comment")

        # Update the review fields if new values are provided
        if updated_comment is not None:
            comment.comment = updated_comment

        # Set the was_edited field to True
        comment.was_edited = True

        # Save the updated review
        comment.save()

        return Response({"message": "Comment updated successfully."}, status=status.HTTP_200_OK)

    def delete(self, request, comment_id):
        # Get the review object by its ID
        comment = get_object_or_404(RecipeComment, id=comment_id)

        # Ensure that the user making the request is the owner of the review
        if request.user != comment.user:
            return Response({"error": "You are not authorized to delete this comment."}, status=status.HTTP_403_FORBIDDEN)

        # Delete the review
        comment.delete()

        return Response({"message": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
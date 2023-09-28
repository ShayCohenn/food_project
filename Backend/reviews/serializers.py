from rest_framework import serializers
from reviews.models import RecipeRating, RecipeComment

class RecipeRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeRating
        fields = ['rating']

class RecipeCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    
    # Get the user that created the comment
    def get_user(self, comment):
        user_data = {
            "username": comment.user.username,
            "profile_pic": comment.user.userproperties.profile_pic
        }
        return user_data
    # Get the user that rated the recipe he commented on
    def get_rating(self, comment):
        recipe = comment.recipe
        user = comment.user
        
        # Check if there's a rating for this recipe and user
        try:
            rating = RecipeRating.objects.get(recipe=recipe, user=user)
            return rating.rating
        except RecipeRating.DoesNotExist:
            return "Didn't rate"  # Return this if no rating found
    
    class Meta:
        model = RecipeComment
        fields = ['comment', 'comment_date', 'user', 'was_edited', 'rating']


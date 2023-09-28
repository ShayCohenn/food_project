from rest_framework import serializers
from users.models import UserProperties
from reviews.models import RecipeComment, RecipeRating
from .models import *
from decimal import Decimal, ROUND_HALF_UP

class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisines
        fields = ['cuisine', 'country', 'flag']  # Correctly includes 'cuisine_flag'

class UserSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    def get_profile_pic(self, user):
        user_properties = UserProperties.objects.get(user=user)
        return user_properties.profile_pic

    class Meta:
        model = User
        fields = ['username', 'profile_pic']
        
class FormattedDateField(serializers.ReadOnlyField):
    def to_representation(self, value):
        if value:
            return value.strftime("%d/%m/%Y")
        return None

class RecipeSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    user_count = serializers.SerializerMethodField()
    ingredients = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    rated_by_users = UserSerializer(many=True, read_only=True)
    ratings = serializers.SerializerMethodField()  # Include ratings with the desired structure
    comments = serializers.SerializerMethodField()  # Include comments with the desired structure
    cuisine = CuisineSerializer()
 
    # Get the user that create the recipe 
    def get_user(self, recipe):
        user = recipe.user_id
        user_properties = UserProperties.objects.get(user=user)
        user_data = {
            "username": user.username,
            "profile_pic": user_properties.profile_pic
        }
        return user_data
    
    # How many users rated this recipe
    def get_user_count(self, recipe):
        user_count = RecipeRating.objects.filter(recipe=recipe).values('user').distinct().count()
        return user_count

    # Get avarage rating of the recipe
    def get_average_rating(self, recipe):
        ratings = RecipeRating.objects.filter(recipe=recipe).values_list('rating', flat=True)
        if ratings:
            average_rating = Decimal(sum(ratings)) / Decimal(len(ratings))
            # Round the average rating to one digit after the decimal point
            average_rating = average_rating.quantize(Decimal('0.0'), rounding=ROUND_HALF_UP)
        else:
            average_rating = Decimal('0.0')
        return str(average_rating)  # Convert the Decimal back to a string

    # Get the ingredients in the recipe
    def get_ingredients(self, recipe):
        ingredients = RecipeIngredient.objects.filter(recipe_id=recipe)
        ingredient_data = []
        for ingredient in ingredients:
            ingredient_info = {
                "ingredient": ingredient.ingredient_id.ingredient,
                "amount": ingredient.amount,
                "notes": ingredient.notes,
            }
            ingredient_data.append(ingredient_info)
        return ingredient_data


    # Get ratings for the recipe
    def get_ratings(self, recipe):
        ratings = RecipeRating.objects.filter(recipe=recipe)
        rating_data = []
        for rating in ratings:
            formatted_date = FormattedDateField().to_representation(rating.rating_date)
            user_data = {
                "username": rating.user.username,
                "profile_pic": rating.user.userproperties.profile_pic  # Use lowercase 'userproperties'
            }
            rating_item = {
                "user": user_data,
                "rating": rating.rating,
                "was_edited": rating.was_edited,
                "formatted_date": formatted_date,
            }
            rating_data.append(rating_item)
        return rating_data

    # Get comments for the recipe
    def get_comments(self, recipe):
        comments = RecipeComment.objects.filter(recipe=recipe)
        comment_data = []
        for comment in comments:
            user_data = {
                "username": comment.user.username,
                "profile_pic": comment.user.userproperties.profile_pic  # Use lowercase 'userproperties'
            }
            try:
                rating = RecipeRating.objects.get(user=comment.user, recipe=recipe)
                rating_value = rating.rating
            except RecipeRating.DoesNotExist:
                rating_value = "Didn't rate"
            formatted_date = FormattedDateField().to_representation(comment.comment_date)
            comment_item = {
                "user": user_data,
                "comment": comment.comment,
                "was_edited": comment.was_edited,
                "formatted_date": formatted_date,
                "rating": rating_value  # Include the rating in the comment data
            }
            comment_data.append(comment_item)
        return comment_data

    class Meta:
        model = Recipe
        exclude = ['user_id', 'recipe_id']

class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ['ingredient'] 

class RecipeIngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecipeIngredient
        fields = [ 'recipe_id', 'ingredient_id', 'amount', 'notes']


class CreateRecipeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recipe
        exclude = ['user_id', 'recipe_id']
from rest_framework.response import Response
from rest_framework.decorators import APIView, authentication_classes,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .serializers import CreateRecipeSerializer, CuisineSerializer, RecipeSerializer, IngredientSerializer
from .models import Cuisines, Recipe, RecipeFavorite, RecipeIngredient, Ingredient

User = get_user_model()

# ------------------------------------------------------------------- Create a Recipe ------------------------------------------------------------------------------

@authentication_classes([JWTAuthentication])
class CreateRecipes(APIView):
    def post(self, request):
        # Get the authenticated user
        user = request.user

        # Extract recipe data from the request data
        cuisine_name = request.data.get("cuisine")
        try:
            cuisine = Cuisines.objects.get(cuisine=cuisine_name) # Check if the Cuisine exists
        except Cuisines.DoesNotExist:
            return Response({"Error": "Unknown Cuisine"}, status=status.HTTP_400_BAD_REQUEST)
        recipe_data = {
            "user_id": user.id,
            "cuisine": cuisine.cuisine,
            "title": request.data.get("title"),
            "difficulty":request.data.get("difficulty"),
            "est_time":request.data.get("est_time"),
            "servings":request.data.get("servings"),
            "description": request.data.get("description"),
            "directions": request.data.get("directions"),
            "thumbnail": request.data.get("thumbnail"),
            "tags": request.data.get("tags")
        }

        # Extract ingredients data from the request data
        ingredients_data = request.data.get("ingredients", [])

        # Check if all ingredients exist in the database
        invalid_ingredients = []
        for ingredient_data in ingredients_data:
            ingredient_name = ingredient_data.get("ingredient")

            try:
                ingredient = Ingredient.objects.get(ingredient=ingredient_name)
            except Ingredient.DoesNotExist:
                invalid_ingredients.append(ingredient_name)

        if invalid_ingredients:
            return Response(f"Unknown ingredients: {', '.join(invalid_ingredients)}", status=status.HTTP_400_BAD_REQUEST)

        # Create the recipe and connect it to the user
        recipe_serializer = CreateRecipeSerializer(data=recipe_data)
        if recipe_serializer.is_valid():
            recipe = recipe_serializer.save(user_id=user)

            # Connect valid ingredients to the recipe
            for ingredient_data in ingredients_data:
                ingredient_name = ingredient_data.get("ingredient")
                amount = ingredient_data.get("amount")
                notes = ingredient_data.get("notes")
                ingredient = Ingredient.objects.get(ingredient=ingredient_name)
                RecipeIngredient.objects.create(recipe_id=recipe, ingredient_id=ingredient, amount=amount, notes=notes)

            # Return the recipe's uuid in the response
            return Response({"message": "Recipe added successfully", "uuid": str(recipe.uuid)}, status=status.HTTP_201_CREATED)
        return Response(recipe_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ------------------------------------------------------------------------------ Delete a Recipe ------------------------------------------------------------------------------
    
@authentication_classes([JWTAuthentication])
class DeleteRecipe(APIView):
    @permission_classes([IsAuthenticated])
    def delete(self, request,user_id, recipe_id):
        user = get_object_or_404(User, id=user_id)
        if user != request.user:
            return Response({"error": "You are not authorized to delete this recipe."}, status=status.HTTP_403_FORBIDDEN)
        recipe = get_object_or_404(Recipe, pk=recipe_id)
        recipe.delete()
        return Response({"message": "Recipe deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
    # ------------------------------------------------------------------------------ Query Recipes ------------------------------------------------------------------------------

@authentication_classes([JWTAuthentication])
class Recipes(APIView):
    def get(self, request):
        recipe_id = request.query_params.get("recipe_id")
        user_id = request.query_params.get("user_id")
        cuisine = request.query_params.get("cuisine")
        title = request.query_params.get("title")
        ingredients_param = request.query_params.get("ingredient")
        tag = request.query_params.get("tag")

        unique_recipe_ids = set() # a unique array so we don't get duped recipes

        if recipe_id:
            unique_recipe_ids.add(recipe_id)

        if user_id:
            user_recipes = Recipe.objects.filter(user_id=user_id)
            unique_recipe_ids.update(user_recipes.values_list('uuid', flat=True))

        if cuisine:
            cuisine_recipes = Recipe.objects.filter(cuisine__cuisine__icontains=cuisine)
            unique_recipe_ids.update(cuisine_recipes.values_list('uuid', flat=True))

        if title:
            title_recipes = Recipe.objects.filter(title__icontains=title)
            unique_recipe_ids.update(title_recipes.values_list('uuid', flat=True))

        if ingredients_param:
            ingredients = ingredients_param.split()
            recipe_ids = []
            for ing in ingredients:
                ingredient_recipes = Recipe.objects.filter(
                    Q(recipeingredient__ingredient_id__ingredient__icontains=ing)
                ).values_list('uuid', flat=True)
                recipe_ids.append(set(ingredient_recipes))

            common_recipe_ids = set.intersection(*recipe_ids)

            unique_recipe_ids.update(common_recipe_ids)

        if tag:
            tag_recipes = Recipe.objects.filter(tags__icontains=tag)
            unique_recipe_ids.update(tag_recipes.values_list('uuid', flat=True))

        if not unique_recipe_ids:
            return Response({"message": "No recipes found."})

        unique_recipes = Recipe.objects.filter(uuid__in=unique_recipe_ids)
        
        serialized_recipes = RecipeSerializer(unique_recipes, many=True).data

        return Response(serialized_recipes)

# ------------------------------------------------------------------------------ Ingredient Search and create ------------------------------------------------------------------------------

class Ingredients(APIView):
    def get(self, request):
        search_term = request.query_params.get("q")
        if search_term == "":
            return Response([], status=status.HTTP_200_OK)
        if not search_term:
            return Response({"Error":"No search query parameters provided"}, status=status.HTTP_400_BAD_REQUEST)
        ingredients = Ingredient.objects.filter(ingredient__icontains=search_term)
        serializer = IngredientSerializer(ingredients, many=True).data

        return Response(serializer, status=status.HTTP_200_OK)
    
    @authentication_classes([JWTAuthentication])
    def post(self, request):
        if request.user != "shay2":
            return Response({"Error":"Unauthorized user"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = IngredientSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ------------------------------------------------------------------------------ Cusine Search ------------------------------------------------------------------------------

class CuisinesSearch(APIView):
    def get(self, request):
        search_term = request.query_params.get("q")

        if search_term or not search_term == "":
            # Query all cuisines and order them alphabetically
            cuisines = Cuisines.objects.all().order_by('cuisine')
            serializer = CuisineSerializer(cuisines, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Query filtered cuisines and order them alphabetically
        cuisines = Cuisines.objects.filter(cuisine__icontains=search_term).order_by('cuisine')
        serializer = CuisineSerializer(cuisines, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

# ------------------------------------------------------------------------------ Add Recipe To Favorites ------------------------------------------------------------------------------

@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class AddToFavorite(APIView):
    def post(self, request, recipe_id):
        # Get the authenticated user
        user = request.user

        # Get the recipe 
        recipe = get_object_or_404(Recipe, uuid=recipe_id)

        # Check if the user has already rated this recipe
        existing_fav = RecipeFavorite.objects.filter(user=user, recipe=recipe).first()

        if existing_fav:
            # If the user has already favorited the recipe, delete 
            existing_fav.delete()
            return Response({"message": "Removed from favorites"}, status=status.HTTP_200_OK)

        # Create a new rating entry
        RecipeFavorite.objects.create(user=user, recipe=recipe)

        return Response({"message": "Recipe added to favorites successfully."}, status=status.HTTP_201_CREATED)
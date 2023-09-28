from django.db import models
from django.contrib.auth.models import User
import uuid

class Cuisines(models.Model):
    cuisine = models.CharField(max_length=30, primary_key=True)
    country = models.CharField(max_length=64, default='other')
    flag = models.TextField(default='https://firebasestorage.googleapis.com/v0/b/food-project-8d454.appspot.com/o/flags%2FTransparent_flag_with_question_mark.png?alt=media&token=a71145f7-0394-4a85-b0cd-0d20253335c3')  # Use the emoji you want here

class Recipe(models.Model):
    recipe_id = models.AutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    cuisine = models.ForeignKey(Cuisines, on_delete=models.SET_NULL, null=True)  # ForeignKey to Cuisines model
    title = models.CharField(max_length=64)
    description = models.TextField(blank=True, null=True)
    directions = models.JSONField()
    thumbnail = models.TextField(default='https://firebasestorage.googleapis.com/v0/b/food-project-8d454.appspot.com/o/profile_images%2Fplaceholder.jpeg?alt=media&token=88e7e170-20a7-4ff8-af75-7e49381cc3f6')
    post_date = models.DateTimeField(auto_now_add=True)
    difficulty = models.CharField(max_length=20, default="Not specified")
    est_time = models.CharField(max_length=50, default="Not specified")
    servings = models.CharField(max_length=50, default="Not specified")
    tags = models.JSONField(null=True)
 
class Ingredient(models.Model):
    Ingrediant_id = models.AutoField(primary_key=True)
    ingredient = models.CharField(max_length=60, unique=True)
    calories = models.IntegerField(null=True)
    api_id = models.IntegerField(null=True)

# Connets the ingredients and the recipes
class RecipeIngredient(models.Model):
    recipe_ingredient_id = models.AutoField(primary_key=True)
    recipe_id = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient_id = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    amount = models.CharField(max_length=30)
    notes = models.TextField()
    
class RecipeFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['user', 'recipe']
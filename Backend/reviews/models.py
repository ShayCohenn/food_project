from django.db import models
from django.contrib.auth.models import User
from recipes.models import Recipe

class RecipeRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=1, choices=[(i, str(i)) for i in range(1, 6)])
    rating_date = models.DateTimeField(auto_now_add=True)
    was_edited = models.BooleanField(default=False)

    class Meta:
        unique_together = ['user', 'recipe']  # Ensures each user can only rate a recipe once

    def __str__(self):
        return f"{self.user.username} rated {self.recipe.title} with rating {self.rating}"

class RecipeComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    comment = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)
    was_edited = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} commented on {self.recipe.title}"


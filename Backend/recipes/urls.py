from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.CreateRecipes.as_view()),
    path('<int:user_id>/<int:recipe_id>/', views.DeleteRecipe.as_view()),
    path('search', views.Recipes.as_view()),
    path('ing', views.Ingredients.as_view()),
    path('cuisine/search', views.CuisinesSearch.as_view()),
    path('favorite/<str:recipe_id>/', views.AddToFavorite.as_view()),
]
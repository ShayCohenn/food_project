from django.urls import path
from . import views

urlpatterns = [
    path('recipe/rate/<str:recipe_id>/', views.RateRecipe.as_view()),
    path('rate/<int:rate_id>/', views.RateSpecificView.as_view()),
    path('recipe/comment/<str:recipe_id>/', views.CommentRecipe.as_view()),
    path('comment/<int:comment_id>/', views.CommentSpecificView.as_view()),
    ]
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from .models import Follow, UserProperties

User = get_user_model()

class UserPropertiesSerializer(ModelSerializer):

    class Meta:
        model = UserProperties  
        fields = ['profile_pic', 'subscribed', 'phone_num']
        read_only_fields = ['user']

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']


class RegisterUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        return user
    
class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username

        return token
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['username'] = self.user.username  # Include the username in the login response
        return data
    

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'
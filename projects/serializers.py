from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, ProjectMembership


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProjectMembership
        fields = ["id", "user", "role"]


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    memberships = ProjectMembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "owner", "memberships", "created_at"]

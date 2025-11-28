from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Project, ProjectMembership
from .serializers import ProjectSerializer, ProjectMembershipSerializer, UserSerializer


def is_project_editor(user, project: Project) -> bool:
    if user == project.owner:
        return True
    return ProjectMembership.objects.filter(
        project=project, user=user, role="editor"
    ).exists()


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        owned = Project.objects.filter(owner=user)
        member = Project.objects.filter(memberships__user=user)
        return (owned | member).distinct()

    def perform_create(self, serializer):
        project = serializer.save(owner=self.request.user)
        # owner is automatically also an editor
        ProjectMembership.objects.get_or_create(
            project=project,
            user=self.request.user,
            defaults={"role": "editor"},
        )

    def update(self, request, *args, **kwargs):
        project = self.get_object()
        if not is_project_editor(request.user, project):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        project = self.get_object()
        if not is_project_editor(request.user, project):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    # ----- Members management -----

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def add_member(self, request, pk=None):
        project = self.get_object()
        if not is_project_editor(request.user, project):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        username = request.data.get("username")
        if not username:
            return Response({"error": "Username required"}, status=400)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)

        if user == project.owner:
            return Response({"error": "Owner already has full access"}, status=400)

        member, created = ProjectMembership.objects.get_or_create(
            project=project,
            user=user,
            defaults={"role": "viewer"},
        )

        if not created:
            return Response({"error": "User is already a member"}, status=400)

        return Response(ProjectMembershipSerializer(member).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def update_role(self, request, pk=None):
        project = self.get_object()
        if not is_project_editor(request.user, project):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        membership_id = request.data.get("membership_id")
        new_role = request.data.get("role")

        membership = ProjectMembership.objects.filter(
            id=membership_id, project=project
        ).first()
        if not membership:
            return Response({"error": "Membership not found"}, status=404)

        if membership.user == project.owner:
            return Response({"error": "Cannot change owner role"}, status=400)

        if new_role not in ["editor", "viewer"]:
            return Response({"error": "Invalid role"}, status=400)

        membership.role = new_role
        membership.save()
        return Response(ProjectMembershipSerializer(membership).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        if not is_project_editor(request.user, project):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        membership_id = request.data.get("membership_id")

        membership = ProjectMembership.objects.filter(
            id=membership_id, project=project
        ).first()
        if not membership:
            return Response({"error": "Membership not found"}, status=404)

        if membership.user == project.owner:
            return Response({"error": "Cannot remove owner"}, status=400)

        membership.delete()
        return Response({"success": True})
    

class UserSearchViewSet(viewsets.ReadOnlyModelViewSet):
    """
    For the 'search usernames as you type' feature.
    /api/users/?search=joh
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        q = self.request.query_params.get("search", "")
        return User.objects.filter(username__icontains=q).order_by("username")[:10]

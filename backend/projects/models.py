from django.db import models
from django.contrib.auth.models import User


class Project(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_projects")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ProjectMembership(models.Model):
    ROLE_CHOICES = (
        ("editor", "Editor"),
        ("viewer", "Viewer"),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="project_memberships")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    class Meta:
        unique_together = ("project", "user")  # each user at most once per project

    def __str__(self):
        return f"{self.user.username} in {self.project.name} as {self.role}"


class DashboardPanel(models.Model):
    """Represents a dashboard panel within a project."""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="panels")
    panel_id = models.CharField(max_length=100)  # Frontend-generated UUID
    title = models.CharField(max_length=255)
    panel_type = models.CharField(max_length=50)  # "line", "bar", "pie", etc.
    grid_w = models.IntegerField(default=1)
    grid_h = models.IntegerField(default=1)
    chart_options = models.JSONField(default=dict)
    query_config = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("project", "panel_id")

    def __str__(self):
        return f"{self.title} ({self.panel_type}) in {self.project.name}"

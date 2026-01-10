from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, ProjectMembership, DashboardPanel


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]


class ProjectMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProjectMembership
        fields = ["id", "user", "role"]


class DashboardPanelSerializer(serializers.ModelSerializer):
    """Serializer for dashboard panels with frontend-compatible field names."""
    id = serializers.CharField(source='panel_id')
    type = serializers.CharField(source='panel_type')
    gridPos = serializers.SerializerMethodField()
    chartOptions = serializers.JSONField(source='chart_options')
    queryConfig = serializers.JSONField(source='query_config', required=False, allow_null=True)

    class Meta:
        model = DashboardPanel
        fields = ["id", "title", "type", "gridPos", "chartOptions", "queryConfig"]

    def get_gridPos(self, obj):
        return {"w": obj.grid_w, "h": obj.grid_h}

    def to_internal_value(self, data):
        # Transform frontend camelCase to model fields
        internal = {}
        internal['panel_id'] = data.get('id')
        internal['title'] = data.get('title')
        internal['panel_type'] = data.get('type')
        grid_pos = data.get('gridPos', {})
        internal['grid_w'] = grid_pos.get('w', 1)
        internal['grid_h'] = grid_pos.get('h', 1)
        internal['chart_options'] = data.get('chartOptions', {})
        internal['query_config'] = data.get('queryConfig')
        return internal


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    memberships = ProjectMembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "owner", "memberships", "created_at"]

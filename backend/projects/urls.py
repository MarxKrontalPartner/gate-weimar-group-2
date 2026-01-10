from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, UserSearchViewSet, DashboardPanelViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'users', UserSearchViewSet, basename='user')

# For nested panels under projects, we manually add the panel routes
urlpatterns = [
    path('', include(router.urls)),
    # Nested panels endpoint: /api/projects/{project_pk}/panels/
    path('projects/<int:project_pk>/panels/', 
         DashboardPanelViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='project-panels-list'),
    path('projects/<int:project_pk>/panels/<str:pk>/', 
         DashboardPanelViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), 
         name='project-panels-detail'),
]

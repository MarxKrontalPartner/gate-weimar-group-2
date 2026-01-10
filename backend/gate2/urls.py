from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts.views import SignupView, LoginView
from projects.views import ProjectViewSet, UserSearchViewSet, DashboardPanelViewSet

# Create DRF router
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'users', UserSearchViewSet, basename='users')

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),

    # Project system + user search
    path('api/', include(router.urls)),

    # Dashboard panels - nested under projects
    path('api/projects/<int:project_pk>/panels/', 
         DashboardPanelViewSet.as_view({'get': 'list', 'post': 'create'}), 
         name='project-panels-list'),
    path('api/projects/<int:project_pk>/panels/<str:pk>/', 
         DashboardPanelViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), 
         name='project-panels-detail'),
]

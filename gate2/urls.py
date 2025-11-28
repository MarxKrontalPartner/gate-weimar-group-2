from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts.views import SignupView, LoginView
from projects.views import ProjectViewSet, UserSearchViewSet

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
]

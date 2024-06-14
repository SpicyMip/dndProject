# api/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('endpoints/', include('endpoints.urls')),  # Incluye las rutas de la aplicación endpoints
]

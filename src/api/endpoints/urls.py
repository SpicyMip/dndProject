# endpoints/urls.py
from django.urls import path
from .views import init_data_view

urlpatterns = [
    path('init_data/', init_data_view, name='init_data'),
]

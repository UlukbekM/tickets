from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData, name='items'),
    path('add/', views.addItem, name='add-item'),
    path('update/<str:pk>/', views.updateItem, name='update-item'),
    path('delete/<str:pk>/', views.deleteItem, name='delete-item'),

    
    path('get-item-by-email/', views.getItemByEmail, name='get-item-by-email'),
    path('add-event-by-email/', views.addEventByEmail, name='add-event-by-email'),
    path('remove-id-by-email/', views.removeIdByEmail, name='remove-id-by-email'),
]

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/scores/', include('scores.urls')),
    path('api/charities/', include('charities.urls')),
    path('api/draws/', include('draws.urls')),
    path('api/prizes/', include('prizes.urls')),
    path('api/payments/', include('payments.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
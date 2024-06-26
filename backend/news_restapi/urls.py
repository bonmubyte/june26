from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from news.views import CategoryViewSet, ArticleViewSet, article_detail

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'articles', ArticleViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/articles/<slug:category>/<slug:url>/', article_detail, name='article-detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

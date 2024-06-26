from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, JournalistViewSet, KeywordViewSet, ArticleViewSet, articles_by_journalist, articles_by_keyword, article_detail

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'journalists', JournalistViewSet)
router.register(r'keywords', KeywordViewSet)
router.register(r'articles', ArticleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('articles/<str:category>/<str:url>/', article_detail, name='article_detail'),
    path('journalist/<str:journalist_slug>/', articles_by_journalist, name='articles_by_journalist'),
    path('keyword/<str:keyword_slug>/', articles_by_keyword, name='articles_by_keyword'),
]

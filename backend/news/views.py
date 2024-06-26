from rest_framework import viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action, api_view
from django.db.models import Q
from .models import Article, Category, Journalist, Keyword
from .serializers import ArticleSerializer, CategorySerializer, JournalistSerializer, KeywordSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class JournalistViewSet(viewsets.ModelViewSet):
    queryset = Journalist.objects.all()
    serializer_class = JournalistSerializer

class KeywordViewSet(viewsets.ModelViewSet):
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def get_queryset(self):
        queryset = Article.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        return queryset

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = self.request.query_params.get('search', None)
        if query:
            queryset = self.get_queryset().filter(
                Q(title__icontains=query) |
                Q(subtitle__icontains=query) |
                Q(content__icontains=query) |
                Q(journalist__name__icontains=query) |
                Q(keywords__name__icontains=query)
            ).distinct()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response([])

    @action(detail=False, methods=['get'])
    def by_keyword(self, request):
        keyword = self.request.query_params.get('keyword', None)
        if keyword:
            keyword_obj = get_object_or_404(Keyword, slug__iexact=keyword)
            queryset = self.get_queryset().filter(keywords__slug__iexact=keyword)
            serializer = self.get_serializer(queryset, many=True)
            profile_serializer = KeywordSerializer(keyword_obj)
            return Response({'articles': serializer.data, 'profile': profile_serializer.data})
        return Response([])

    @action(detail=False, methods=['get'])
    def by_journalist(self, request):
        journalist = self.request.query_params.get('journalist', None)
        if journalist:
            journalist_obj = get_object_or_404(Journalist, slug__iexact=journalist)
            queryset = self.get_queryset().filter(journalist__slug__iexact=journalist)
            serializer = self.get_serializer(queryset, many=True)
            profile_serializer = JournalistSerializer(journalist_obj)
            return Response({'articles': serializer.data, 'profile': profile_serializer.data})
        return Response([])

@api_view(['GET'])
def article_detail(request, category, url):
    category_obj = get_object_or_404(Category, name__iexact=category)
    article = get_object_or_404(Article, category=category_obj, url=url)
    serializer = ArticleSerializer(article)

    # Logic for recommended articles
    recommended_articles = Article.objects.filter(keywords__in=article.keywords.all()).exclude(id=article.id).distinct().order_by('-date_published')[:100]
    recommended_articles = sorted(recommended_articles, key=lambda x: x.date_published, reverse=True)[:3]

    recommended_serializer = ArticleSerializer(recommended_articles, many=True)
    return Response({'article': serializer.data, 'recommended_articles': recommended_serializer.data})

# serializers.py
from rest_framework import serializers
from .models import Article, Category, Journalist, Keyword

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class JournalistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journalist
        fields = '__all__'

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    journalist = JournalistSerializer()
    keywords = KeywordSerializer(many=True)

    class Meta:
        model = Article
        fields = '__all__'

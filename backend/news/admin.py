from django.contrib import admin
from .models import Article, Category, Journalist, Keyword

class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'journalist', 'date_published', 'url', 'top_news_order')
    search_fields = ('title', 'content', 'journalist__name')
    list_filter = ('category', 'date_published')
    ordering = ('-date_published',)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)

class JournalistAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

class KeywordAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(Article, ArticleAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Journalist, JournalistAdmin)
admin.site.register(Keyword, KeywordAdmin)

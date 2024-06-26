from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Journalist(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    profile_name = models.CharField(max_length=100, blank=True, null=True)
    profile_description = models.TextField(max_length=200, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Keyword(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    profile_name = models.CharField(max_length=100, blank=True, null=True)
    profile_description = models.TextField(max_length=200, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Article(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300)
    image = models.ImageField(upload_to='images/')
    image_caption = models.CharField(max_length=200)
    journalist = models.ForeignKey(Journalist, on_delete=models.CASCADE)
    date_published = models.DateTimeField()
    content = models.TextField()
    url = models.SlugField(max_length=300, unique=True, blank=True)
    top_news_order = models.PositiveIntegerField(default=0)
    keywords = models.ManyToManyField(Keyword, blank=True)

    def save(self, *args, **kwargs):
        if not self.url:
            self.url = slugify(f"{self.category.name}-{self.title.split()[0]}-{self.pk}")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

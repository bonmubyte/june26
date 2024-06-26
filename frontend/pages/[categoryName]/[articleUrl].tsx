import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../services/api";
import Header from "../../components/Header";
import Link from "next/link";
import styles from "../../styles/ArticleDetail.module.css";

interface Article {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  url: string;
  category: { name: string };
  journalist: { name: string; slug: string };
  date_published: string;
  content: string;
  keywords: { name: string; slug: string }[];
}

const ArticleDetailPage: React.FC = () => {
  const router = useRouter();
  const { categoryName, articleUrl } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (categoryName && articleUrl) {
      api
        .get(`/articles/${categoryName}/${articleUrl}`)
        .then((response) => {
          setArticle(response.data.article);
          setRecommendedArticles(response.data.recommended_articles);
        })
        .catch((error) => {
          console.error("Error fetching article:", error);
        });
    }
  }, [categoryName, articleUrl]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className={styles.articleDetailContainer}>
        <div className={styles.articleDetailContent}>
          <div className={styles.articleDetailCategory}>
            <Link href={`/${article.category.name.toLowerCase()}`} passHref>
              <span className={styles.categoryLink}>
                {article.category.name.toUpperCase()}
              </span>
            </Link>
          </div>
          <h1 className={styles.articleDetailTitle}>{article.title}</h1>
          <h2 className={styles.articleDetailSubtitle}>{article.subtitle}</h2>
          <img
            src={`http://localhost:8000${article.image}`}
            alt={article.title}
            className={styles.articleDetailImage}
          />
          <p className={styles.articleDetailInfo}>
            By{" "}
            <Link href={`/journalist/${article.journalist.slug}`} passHref>
              <span className={styles.journalistLink}>
                {article.journalist.name}
              </span>
            </Link>{" "}
            | {new Date(article.date_published).toLocaleDateString()}
          </p>
          <div className={styles.articleDetailText}>{article.content}</div>
          {article.keywords.length > 0 && (
            <div className={styles.keywords}>
              <strong>Keywords: </strong>
              {article.keywords.map((keyword, index) => (
                <Link href={`/keyword/${keyword.slug}`} key={index} passHref>
                  <span className={styles.keywordLink}>{keyword.name}</span>
                </Link>
              ))}
            </div>
          )}
          <div className={styles.recommendedArticlesContainer}>
            <h2 className={styles.recommendedArticlesTitle}>
              Recommended Articles
            </h2>
            <div className={styles.recommendedArticlesList}>
              {recommendedArticles.map((recArticle) => (
                <Link
                  href={`/${recArticle.category.name.toLowerCase()}/${
                    recArticle.url
                  }`}
                  key={recArticle.id}
                  passHref
                >
                  <div className={styles.recommendedArticleItem}>
                    <img
                      src={`http://localhost:8000${recArticle.image}`}
                      alt={recArticle.title}
                      className={styles.recommendedArticleImage}
                    />
                    <div className={styles.recommendedArticleContent}>
                      <h3 className={styles.recommendedArticleTitle}>
                        {recArticle.title}
                      </h3>
                      <p className={styles.recommendedArticleDate}>
                        {new Date(
                          recArticle.date_published
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;

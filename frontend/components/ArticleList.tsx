import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../services/api";
import styles from "../styles/ArticleList.module.css";

interface Category {
  name: string;
}

interface Article {
  id: number;
  category: Category;
  title: string;
  subtitle: string;
  image: string;
  image_caption: string;
  journalist_name: string;
  date_published: string;
  content: string;
  url: string;
}

interface ArticleListProps {
  category: string;
}

const ArticleList: React.FC<ArticleListProps> = ({ category }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      api
        .get(`/articles?category=${category}&ordering=-date_published`)
        .then((response) => {
          setArticles(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching articles:", error);
          setError("Error fetching articles");
          setLoading(false);
        });
    }
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.articleList}>
      {articles.map((article) => (
        <div key={article.id} className={styles.articleItem}>
          <Link
            href={`/${article.category.name.toLowerCase()}/${article.url}`}
            legacyBehavior
          >
            <a>
              <img
                src={`http://localhost:8000${article.image}`}
                alt={article.title}
                className={styles.articleThumbnail}
              />
              <h2>{article.title}</h2>
              <p>{article.subtitle}</p>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;

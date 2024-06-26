import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../services/api";
import styles from "../styles/TopNews.module.css";

interface Article {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  url: string;
  category: { name: string } | null;
  journalist: { name: string };
  date_published: string;
  top_news_order: number;
}

const TopNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    api
      .get("/articles/?ordering=top_news_order&limit=5")
      .then((response) => {
        setArticles(response.data);
        console.log("API Response for Top News:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching top news:", error);
      });
  }, []);

  return (
    <div className={styles.topNewsContainer}>
      {articles.map((article) => (
        <Link
          href={`/${article.category?.name.toLowerCase() || "uncategorized"}/${
            article.url
          }`}
          key={article.id}
          legacyBehavior
        >
          <a
            className={`${styles.topNewsItem} ${
              styles[`topNewsOrder${article.top_news_order}`]
            }`}
          >
            <img
              src={article.image}
              alt={article.title}
              className={styles.topNewsImage}
            />
            <div className={styles.topNewsContent}>
              <span className={styles.topNewsCategory}>
                {article.category?.name || "Uncategorized"}
              </span>
              <h2 className={styles.topNewsTitle}>{article.title}</h2>
              <p className={styles.topNewsJournalist}>
                By {article.journalist.name}
              </p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default TopNews;

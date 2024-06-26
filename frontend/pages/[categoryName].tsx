import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../components/Header";
import api from "../services/api";
import styles from "../styles/CategoryPage.module.css";

interface Article {
  id: number;
  title: string;
  subtitle: string;
  journalist_name: string;
  date_published: string;
  image: string;
  category: { name: string };
  content: string;
  url: string;
}

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { categoryName } = router.query;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryName) {
      console.log(`Fetching articles for category: ${categoryName}`);
      api
        .get(`/articles?category=${categoryName}&ordering=-date_published`)
        .then((response) => {
          console.log(
            `Fetched articles:`,
            response.data.map((article: Article) => ({
              title: article.title,
              date_published: article.date_published,
            }))
          );
          setArticles(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching category articles:", error);
          setError("Error fetching category articles");
          setLoading(false);
        });
    }
  }, [categoryName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <h1>{categoryName} News</h1>
        <div className={styles.results}>
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <Link
                href={`/${article.category.name.toLowerCase()}/${article.url}`}
                key={article.id}
                legacyBehavior
              >
                <a
                  className={`${styles.article} ${
                    index === 0 ? styles.featured : ""
                  }`}
                >
                  <img
                    src={
                      article.image.startsWith("http")
                        ? article.image
                        : `http://localhost:8000${article.image}`
                    }
                    alt={article.title}
                    className={`${styles.thumbnail} ${
                      index === 0 ? styles.featuredThumbnail : ""
                    }`}
                  />
                  <div className={styles.articleInfo}>
                    <h2>{article.title}</h2>
                    <p className={styles.subtitle}>{article.subtitle}</p>
                    <p>
                      By {article.journalist_name} on{" "}
                      {new Date(article.date_published).toLocaleString()}
                    </p>
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;

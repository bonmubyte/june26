import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../../components/Header";
import api from "../../services/api"; // Ensure you have an api service for making requests
import styles from "../../styles/Search.module.css";

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

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { query } = router.query;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      api
        .get(`/articles/search?search=${query}`)
        .then((response) => {
          setArticles(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setError("Error fetching search results");
          setLoading(false);
        });
    }
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header />
      <main>
        <h1>Search Results for "{query}"</h1>
        <div className={styles.results}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                href={`/${article.category.name.toLowerCase()}/${article.url}`}
                key={article.id}
                legacyBehavior
              >
                <a className={styles.article}>
                  <img
                    src={
                      article.image.startsWith("http")
                        ? article.image
                        : `http://localhost:8000${article.image}`
                    }
                    alt={article.title}
                    className={styles.thumbnail}
                  />
                  <div className={styles.articleInfo}>
                    <h2>{article.title}</h2>
                    <p>
                      By {article.journalist_name} on{" "}
                      {new Date(article.date_published).toLocaleDateString()}
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

export default SearchPage;

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "../services/api";
import StockChart from "./StockChart";

interface Category {
  name: string;
}

interface Article {
  id: number;
  category: Category;
  title: string;
  url: string;
}

const LatestNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/articles/?ordering=-date_published&limit=10")
      .then((response) => {
        console.log("API Response for Latest News:", response.data);
        setArticles(response.data.results || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching latest news:", error);
        setError("Error fetching latest news");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Latest News</h2>
      <StockChart />
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              href={`/${article.category.name.toLowerCase()}/${article.url}`}
              legacyBehavior
            >
              <a>{article.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestNews;

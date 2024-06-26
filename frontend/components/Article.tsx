import React, { useEffect, useState } from "react";
import api from "../services/api";
import Link from "next/link";

interface ArticleProps {
  id: string;
}

interface Article {
  id: number;
  category: { name: string };
  title: string;
  subtitle: string;
  image: string;
  image_caption: string;
  journalist: { name: string };
  date_published: string;
  content: string;
}

const Article: React.FC<ArticleProps> = ({ id }) => {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    api.get(`/articles/${id}/`).then((response) => {
      setArticle(response.data);
    });
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <h2>{article.subtitle}</h2>
      <img src={article.image} alt={article.title} />
      <p>{article.image_caption}</p>
      <p>
        <strong>
          <Link href={`/journalist/${article.journalist.name}`}>
            {article.journalist.name}
          </Link>
        </strong>
      </p>
      <p>{new Date(article.date_published).toLocaleString()}</p>
      <div>{article.content}</div>
    </div>
  );
};

export default Article;

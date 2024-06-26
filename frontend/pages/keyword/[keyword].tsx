import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "../../components/Header";
import api from "../../services/api";
import ProfileCard from "../../components/ProfileCard";
import styles from "../../styles/KeywordPage.module.css";

interface Article {
  id: number;
  category: { name: string };
  title: string;
  subtitle: string;
  image: string;
  journalist: { name: string };
  date_published: string;
  url: string;
}

interface Profile {
  profile_picture: string;
  profile_name: string;
  profile_description: string;
}

const KeywordPage: React.FC = () => {
  const router = useRouter();
  const { keyword } = router.query;
  const [articles, setArticles] = useState<Article[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (keyword) {
      const decodedKeyword = decodeURIComponent(keyword as string);
      console.log(`Fetching articles for keyword: ${decodedKeyword}`);
      api
        .get(`/articles/by_keyword?keyword=${decodedKeyword}`)
        .then((response) => {
          console.log("Fetched articles:", response.data.articles);
          setArticles(response.data.articles);
          setProfile(response.data.profile);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching keyword articles:", error);
          setError("Error fetching keyword articles");
          setLoading(false);
        });
    }
  }, [keyword]);

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
        {profile && <ProfileCard profile={profile} />}
        <h1>Articles related to "{keyword}"</h1>
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
                    <p>{article.subtitle}</p>
                    <p>
                      By {article.journalist.name} on{" "}
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

export default KeywordPage;

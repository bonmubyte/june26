import React from "react";
import Header from "../components/Header";
import LatestNews from "../components/LatestNews";
import TopNews from "../components/TopNews";

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <div className="latest-news">
          <LatestNews />
        </div>
        <div className="top-news">
          <TopNews />
        </div>
      </main>
    </div>
  );
};

export default HomePage;

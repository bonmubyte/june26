import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${searchQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/" legacyBehavior>
          <a>
            <img src="/logo.png" alt="Logo" />
          </a>
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/politics" legacyBehavior>
          <a>Politics</a>
        </Link>
        <Link href="/technology" legacyBehavior>
          <a>Technology</a>
        </Link>
        <Link href="/business" legacyBehavior>
          <a>Business</a>
        </Link>
        <Link href="/culture" legacyBehavior>
          <a>Culture</a>
        </Link>
      </nav>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={handleSearchInputChange}
          onKeyPress={handleKeyPress}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          <img src="/search-icon.svg" alt="Search" />
        </button>
      </div>
    </header>
  );
};

export default Header;

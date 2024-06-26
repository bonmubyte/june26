import React from "react";
import styles from "../styles/ProfileCard.module.css";

interface Profile {
  profile_picture: string;
  profile_name: string;
  profile_description: string;
}

const ProfileCard: React.FC<{ profile: Profile }> = ({ profile }) => {
  return (
    <div className={styles.profileCard}>
      <img
        src={`http://localhost:8000${profile.profile_picture}`}
        alt={profile.profile_name}
        className={styles.profileImage}
      />
      <h2 className={styles.profileName}>{profile.profile_name}</h2>
      <p className={styles.profileDescription}>{profile.profile_description}</p>
    </div>
  );
};

export default ProfileCard;

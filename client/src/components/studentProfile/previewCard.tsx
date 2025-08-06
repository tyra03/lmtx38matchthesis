import { FC } from "react";
import "../../css/card.css";

interface Props {
  name: string;
  program: string;
  imageUrl?: string;
  description?: string;
}

const ProfileCard: FC<Props> = ({ name, program, imageUrl, description }) => {
  const imageSrc =
    imageUrl && !imageUrl.startsWith("http")
      ? `http://localhost:5000${imageUrl}`
      : imageUrl;

  return (
    <div className="card-container">
      <div className="card-inner">
        <div className="card-front">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Profile"
              className="card-image"
            />
          ) : (
            <div className="no-image">
              No Image
            </div>
          )}
          <h4>{name}</h4>
          <p>{program}</p>
        </div>
        <div className="card-back">
          <h5>About Me</h5>
          <p>{description || "No description provided."}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

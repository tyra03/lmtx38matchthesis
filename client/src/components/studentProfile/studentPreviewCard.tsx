import React from "react";
import "../../css/studentPreviewCard.css";

interface Props {
  name: string;
  program: string;
  imageUrl?: string;
  description?: string;
}

const StudentPreviewCard: React.FC<Props> = ({ name, program, imageUrl, description }) => {
  const imageSrc = imageUrl && !imageUrl.startsWith("http")
    ? `http://localhost:5000${imageUrl}`
    : imageUrl;

  return (
    <div className="student-card-container">
      <div className="student-card-inner">
        <div className="student-card-front">
          {imageSrc ? (
            <img src={imageSrc} alt="Profile" className="student-card-image" />
          ) : (
            <div className="student-no-image">No Image</div>
          )}
          <h4>{name}</h4>
          <p>{program}</p>
        </div>
        <div className="student-card-back">
          <h5>About Me</h5>
          <p>{description || "No description provided."}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPreviewCard;
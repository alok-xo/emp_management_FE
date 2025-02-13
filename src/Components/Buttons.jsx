import React from "react";
import "../Css/button.css"; // Import the CSS file

const Button = ({ text, onClick }) => {
  return (
    <button className="custom-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
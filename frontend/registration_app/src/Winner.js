import React, { useState } from "react";
import axios from "axios";
import env from "react-dotenv";
import "../src/css/Winner.css";

const Winner = () => {
  const [winner, setWinner] = useState(null);
  // const [message, setMessage] = useState({ text: "", type: "" });
  // const [loading, setLoading] = useState(false); // Add loading state

  const handleClick = async () => {
    try {
      const response = await axios.get("http://localhost:5000/winner");
      console.log(response.data);
      if (response.data === "It's a tie") {
        //setMessage({ text: "It's a tie!", type: "success" });
        setWinner("Taz");
      }
    } catch (error) {
      console.error("Something is wrong", error);
      // setMessage({
      //   text: "Something is wrong. Please try again.",
      //   type: "error",
      // });
    } finally {
      //setLoading(false); // Set loading to false after the request completes
    }
    // const randomWinner = Math.random() < 0.5 ? "Don" : "Taz";
  };

  const DON_PINATA = env.DON_PINATA;
  const TAZ_PINATA = env.TAZ_PINATA;

  return (
    <div className="winner-container">
      {!winner ? (
        <div className="circle" onClick={handleClick}>
          <p className="circle-text">Who is the winner?</p>
        </div>
      ) : (
        <div className="winner-image-container">
          <img
            src={winner === "Don" ? DON_PINATA : TAZ_PINATA}
            alt={`${winner} wins`}
            className="winner-image"
          />
          <div className="confetti"></div>
        </div>
      )}
    </div>
  );
};

export default Winner;

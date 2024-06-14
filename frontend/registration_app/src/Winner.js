import React, { useState } from "react";
import axios from "axios";
import env from "react-dotenv";
import "../src/css/Winner.css";

const Winner = () => {
  const [winner, setWinner] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleClick = async () => {
    try {
      const response = await axios.get("http://localhost:5000/winner");
      console.log(response.data);
      if (response.data === "It's a tie") {
        setSuccessMessage(response.data);
        setWinner("");
      } else if (response.data.winners_name === env.DONALD) {
        setSuccessMessage(
          `The Winner is ${response.data.winners_name} with ${response.data.number_of_votes} votes`
        );
        setWinner(env.DONALD);
      } else if (response.data.winners_name === env.TAZ) {
        setSuccessMessage(
          `The Winner is ${response.data.winners_name} with ${response.data.number_of_votes} votes`
        );
        setWinner(env.TAZ);
      }
    } catch (error) {
      console.error("Something is wrong", error);
      setSuccessMessage("Something is wrong", error);
      setWinner("");
    }
  };

  return (
    <div className="winner-container">
      {!winner ? (
        <div className="circle" onClick={handleClick}>
          <p className="circle-text">Who is the winner?</p>
        </div>
      ) : (
        <div className="winner-image-container">
          <img
            src={winner === env.DONALD ? env.DON_PINATA : env.TAZ_PINATA}
            alt={`${winner} wins`}
            className="winner-image"
          />
          <div className="confetti"></div>
        </div>
      )}
      {successMessage && <p className="message success">{successMessage}</p>}
    </div>
  );
};

export default Winner;

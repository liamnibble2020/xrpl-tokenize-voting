import React, { useState, useEffect } from "react";
import env from "react-dotenv";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import "../src/css/Candidate.css";

const Candidates = () => {
  const [numberNfts, setNumberNfts] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateToken = async () => {
    setTokenLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await axios.get(env.TOKENIZE);
      console.log(response.data);
      if (response.data === "No voters NFTS found") {
        setSuccessMessage(response.data);
      } else {
        setSuccessMessage("Token created successfully!");
      }
    } catch (error) {
      console.error("Error creating token:", error);
      setErrorMessage("Error creating token. Please try again.");
    } finally {
      setTokenLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      setErrorMessage("");
      try {
        const response = await axios.get(env.GET_NFT);
        console.log(response.data);
        setNumberNfts(response.data.uri.length);
      } catch (error) {
        console.error("Error fetching the data:", error);
        setErrorMessage("Error fetching the data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="candidate-container">
      {fetchLoading && (
        <div className="loading-overlay">
          <Oval color="#00BFFF" height={150} width={150} />
        </div>
      )}
      <div className={fetchLoading ? "content-blur" : ""}>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="top-section">
          <div className="image-box">
            <img src={env.DON_PINATA} alt="Donald" />
          </div>
          <div className="number-box">{numberNfts}</div>
        </div>
        <div className="top-section">
          <div className="image-box">
            <img src={env.TAZ_PINATA} alt="Taz" />
          </div>
          <div className="number-box">{numberNfts}</div>
        </div>
        {tokenLoading && (
          <div className="loading-overlay">
            <Oval color="#00BFFF" height={150} width={150} />
          </div>
        )}
        <button
          onClick={handleCreateToken}
          className={`green-button ${tokenLoading ? "luminous" : ""}`}
        >
          {tokenLoading
            ? "Tokenizing Candidate and Sending Tokens to Voters"
            : "Create a Token"}
        </button>
      </div>
    </div>
  );
};

export default Candidates;

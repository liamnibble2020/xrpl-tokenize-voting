import React, { useState, useEffect } from "react";
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
      const response = await axios.get("http://localhost:5000/tokenize");
      console.log(response.data);
      setSuccessMessage("Token created successfully!");
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
        const response = await axios.get("http://localhost:5000/get_nft");
        console.log(response.data);
        setNumberNfts(response.data.numbers_of_nfts);
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
            <img
              src="https://ipfs.io/ipfs/QmYeE3ueDAWoyUVWhZbYLZKqXt5i4GjHDVe5yz9HtMa6gR"
              alt="Donald"
            />
          </div>
          <div className="number-box">{numberNfts}</div>
        </div>
        <div className="top-section">
          <div className="image-box">
            <img
              src="https://ipfs.io/ipfs/QmcRRygivrKt3rbWM4EysaH9hAhwbByFb6Q62aSHJPP1pr"
              alt="Taz"
            />
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

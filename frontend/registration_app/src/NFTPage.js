import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/css/NFT.css";

const NFTPage = () => {
  const [uriList, setUriList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_nft");
        setUriList(response.data.uri);
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="nft-container">
      <h1>NFT Display</h1>
      <div className="iframe-wrapper">
        {uriList.map((uri, index) => (
          <iframe
            key={index}
            src={uri}
            title={`NFT${index + 1}`}
            className="nft-iframe"
            scrolling="no"
          />
        ))}
      </div>
    </div>
  );
};

export default NFTPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/css/NFT.css";

const NFTPage = () => {
  const [uriList, setUriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/get_nft");
        console.log(response.data);
        setUriList(response.data.uri || []);
      } catch (error) {
        console.error("Error fetching the data:", error);
        setError("Error fetching the data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="nft-container">
      <div className="iframe-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : uriList && uriList.length > 0 ? (
          uriList.map((uri, index) => (
            <iframe
              key={index}
              src={uri}
              title={`NFT${index + 1}`}
              className="nft-iframe"
              scrolling="no"
            />
          ))
        ) : (
          <p>No NFTs found</p>
        )}
      </div>
    </div>
  );
};

export default NFTPage;

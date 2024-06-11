import React, { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import "../src/css/Voting.css";

const Voting = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    birthday: "",
    pin: "",
  });
  const [candidate, setCandidate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [confirmCandidate, setConfirmCandidate] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false); // Add loading state

  const Voting = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/voting", data);
      console.log(response.data);
      setMessage({ text: "Vote submitted successfully!", type: "success" });
    } catch (error) {
      console.error("Error creating token:", error);
      setMessage({
        text: "Error submitting vote. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  const handleVoteClick = (candidateName) => {
    setCandidate(candidateName);
    setConfirmCandidate(candidateName);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    Voting({ ...formData, candidate });
    setShowForm(false);
    setConfirmCandidate("");
  };

  return (
    <div className="voting-container">
      <div className="top-section">
        <div className="image-box">
          <img
            src="https://ipfs.io/ipfs/QmYeE3ueDAWoyUVWhZbYLZKqXt5i4GjHDVe5yz9HtMa6gR"
            alt="Don"
            className="oval-image"
          />
        </div>
        <div className="vote-section">
          <button onClick={() => handleVoteClick("Don")} class="vote-button">
            Vote for Don
          </button>
          {showForm && confirmCandidate === "Don" && (
            <div className="modal">
              <h2>Are you sure you want to vote for {confirmCandidate}?</h2>
              <p>Fill the blanks to complete your vote</p>
              <form className="show-form" onSubmit={handleSubmit}>
                <label>
                  Firstname:
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Middlename:
                  <input
                    type="text"
                    name="middlename"
                    value={formData.middlename}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Lastname:
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Birthday:
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  PIN:
                  <input
                    type="password"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    required
                  />
                </label>
                <p></p>
                <button type="submit">Vote Now</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <div className="top-section">
        <div className="image-box">
          <img
            src="https://ipfs.io/ipfs/QmcRRygivrKt3rbWM4EysaH9hAhwbByFb6Q62aSHJPP1pr"
            alt="Taz"
            className="oval-image"
          />
        </div>
        <div className="vote-section">
          <button onClick={() => handleVoteClick("Taz")} class="vote-button">
            Vote for Taz
          </button>
          {showForm && confirmCandidate === "Taz" && (
            <div className="modal">
              <h2>Are you sure you want to vote for {confirmCandidate}?</h2>
              <p>Fill the blanks to complete your vote</p>
              <form className="show-form" onSubmit={handleSubmit}>
                <label>
                  Firstname:
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Middlename:
                  <input
                    type="text"
                    name="middlename"
                    value={formData.middlename}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Lastname:
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Birthday:
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  PIN:
                  <input
                    type="password"
                    name="pin"
                    value={formData.pin}
                    onChange={handleChange}
                    required
                  />
                </label>
                <p></p>
                <button type="submit">Vote Now</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      {loading && (
        <div className="loading-overlay">
          <Oval color="#00BFFF" height={150} width={150} />
        </div>
      )}
    </div>
  );
};

export default Voting;

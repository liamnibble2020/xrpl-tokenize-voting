import React, { useState, useEffect } from "react";
import "../src/css/Registration.css";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const Registration = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    birthday: "",
    email: "",
    gender: "",
    address: "",
    image: null,
    pincode: "",
    confirmPincode: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const { pincode, confirmPincode } = formData;
    if (pincode === confirmPincode && pincode.length === 6) {
      setIsButtonDisabled(false);
      setErrorMessage("");
    } else {
      setIsButtonDisabled(true);
      if (
        pincode.length === 6 &&
        confirmPincode.length === 6 &&
        pincode !== confirmPincode
      ) {
        setErrorMessage("Pincodes do not match.");
      } else {
        setErrorMessage("");
      }
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:5000/upload", data);
      console.log("Server Response:", response);
      setSuccessMessage("Form submitted successfully!");
      setErrorMessage("");
    } catch (error) {
      console.error("Error uploading the file", error);
      setSuccessMessage("");
      setErrorMessage("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Middle Name:</label>
          <input
            type="text"
            name="middlename"
            value={formData.middlename}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <label className="gender-label">Gender:</label>
        <div className="gender-options">
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              required
            />{" "}
            Male
          </label>
          <label className="gender-option">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              required
            />{" "}
            Female
          </label>
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label htmlFor="pincode">Pincode:</label>
          <input
            type="password"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength="6"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPincode">Confirm Pincode:</label>
          <input
            type="password"
            id="confirmPincode"
            name="confirmPincode"
            value={formData.confirmPincode}
            onChange={handleChange}
            maxLength="6"
            required
          />
        </div>
        <button
          className="submit-button"
          type="submit"
          disabled={isButtonDisabled || loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {loading && (
        <div className="loader-container">
          <Oval color="#00BFFF" height={150} width={150} />
        </div>
      )}
      {successMessage && <p className="message success">{successMessage}</p>}
      {errorMessage && <p className="message error">{errorMessage}</p>}
    </div>
  );
};

export default Registration;

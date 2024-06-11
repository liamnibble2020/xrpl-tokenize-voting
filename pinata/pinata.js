const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkYzAyYzk0Mi0xMGFiLTRlYWItYWI5MC03NDE0NWEyOTg1NzkiLCJlbWFpbCI6ImxpYW1uaWJibGVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjA5ODU3YmM1N2E3NDdlMjY0OThjIiwic2NvcGVkS2V5U2VjcmV0IjoiN2U5M2YwMTg5ZjFjN2VjNTY0M2IzYjM0ZjhjZTJlMTZiNjdkNThmODhkNmYyZDkzYmUwNDY2N2YzOGY3YjlmYiIsImlhdCI6MTcxNjEzNjIxMX0.opHZ_qlYEeHCkVx_gFjrzt50s03lFXPx3eSsPLb_I9c`;

const pinFileToIPFS = async () => {
  const formData = new FormData();
  // create a loop o upload the image
  const src = "./spiders/Jumping Spiders.png";

  const file = fs.createReadStream(src);
  formData.append("file", file);

  const pinataMetadata = JSON.stringify({
    name: "Jumping Spiders.png",
  });

  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

pinFileToIPFS();

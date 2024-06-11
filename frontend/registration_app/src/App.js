import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./Registration";
import NFTPage from "./NFTPage";
import Candidates from "./Candidates";
import Voting from "./Voting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/registration" element={<Registration />} />
        <Route path="/nft" element={<NFTPage />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/voting" element={<Voting />} />
      </Routes>
    </Router>
  );
}

export default App;

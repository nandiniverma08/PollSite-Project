import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./Header";

import Home from "./Home";
import PollDetail from "./PollDetail";
import Vote from "./Vote";
import CreatePoll from "./CreatePoll";

function App() {
  return (
    <BrowserRouter forceRefresh={true}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/polldetail" element={<PollDetail />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/createpoll" element={<CreatePoll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

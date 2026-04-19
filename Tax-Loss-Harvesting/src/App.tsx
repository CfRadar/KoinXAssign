import { useState } from "react";
import "./styles/main.css";
import DisclaimerBar from "./components/DisclaimerBar";
import PreHarvest from "./components/PreHarvest";
import AfterHarvest from "./components/AfterHarvest";

function App() {
  useState;

  return (
    <div className="main-container">
      <DisclaimerBar title={"Important Notes & Disclaimers"}></DisclaimerBar>
      <div className="Harvest-container">
        <PreHarvest></PreHarvest>
        <AfterHarvest></AfterHarvest>
      </div>
    </div>
  );
}

export default App;

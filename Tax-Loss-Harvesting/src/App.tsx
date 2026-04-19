import { useState } from "react";
import "./styles/main.css";
import DisclaimerBar from "./components/DisclaimerBar";
import PreHarvest from "./components/PreHarvest";
import AfterHarvest from "./components/AfterHarvest";
import HoldingsTable from "./components/HoldingsTable";

function App() {
  const [selectedHoldings, setSelectedHoldings] = useState<any[]>([]);

  return (
    <div className="main-container">
      <DisclaimerBar title={"Important Notes & Disclaimers"}></DisclaimerBar>
      <div className="Harvest-container">
        <PreHarvest></PreHarvest>
        <AfterHarvest selectedHoldings={selectedHoldings} />
      </div>
      <div className="Holdings-container">
        <HoldingsTable onSelectionChange={setSelectedHoldings}></HoldingsTable>
      </div>
    </div>
  );
}

export default App;

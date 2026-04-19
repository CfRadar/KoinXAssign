import { useEffect, useState } from "react";
import "./styles/main.css";
import Header from "./components/Header";
import DisclaimerBar from "./components/DisclaimerBar";
import PreHarvest from "./components/PreHarvest";
import AfterHarvest from "./components/AfterHarvest";
import HoldingsTable from "./components/HoldingsTable";

function App() {
  const [selectedHoldings, setSelectedHoldings] = useState<any[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };

    applyTheme(mediaQuery);
    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, []);

  return (
    <>
      <Header />
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
    </>
  );
}

export default App;

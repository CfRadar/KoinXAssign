import { useEffect, useState } from "react";
import "../styles/PreHarvest.css";

export default function PreHarvest() {
  const [capitalGains, setCapitalGains] = useState<any>(null);

  useEffect(() => {
    const fetchCapitalGains = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/capital-gains");
        const data = await res.json();
        setCapitalGains(data.capitalGains);
      } catch (err) {
        console.error("Error fetching capital gains:", err);
      }
    };

    fetchCapitalGains();
  }, []);

  if (!capitalGains) {
    return <div className="loading-text">Loading...</div>;
  }

  const stcgProfit = capitalGains.stcg.profits;
  const stcgLoss = capitalGains.stcg.losses;
  const stcgNet = stcgProfit - stcgLoss;

  const ltcgProfit = capitalGains.ltcg.profits;
  const ltcgLoss = capitalGains.ltcg.losses;
  const ltcgNet = ltcgProfit - ltcgLoss;

  const totalGain = stcgNet + ltcgNet;

  return (
    <div className="pre-harvest-card">
      <div className="pre-title">Pre Harvesting</div>

      <div className="pre-row pre-header-row">
        <div></div>
        <div>Short-term</div>
        <div>Long-term</div>
      </div>

      <div className="pre-row">
        <div className="row-label">Profits</div>
        <div>$ {stcgProfit.toLocaleString()}</div>
        <div>$ {ltcgProfit.toLocaleString()}</div>
      </div>

      <div className="pre-row">
        <div className="row-label">Losses</div>
        <div>- $ {stcgLoss.toLocaleString()}</div>
        <div>- $ {ltcgLoss.toLocaleString()}</div>
      </div>

      <div className="pre-row">
        <div className="row-label">Net Capital Gains</div>
        <div>$ {stcgNet.toLocaleString()}</div>
        <div style={{ color: ltcgNet < 0 ? "#ff4d4d" : undefined }}>
          $ {ltcgNet.toLocaleString()}
        </div>
      </div>

      <div className="realised-row">
        <div className="row-label">Realised Capital Gains:</div>
        <div className="total-gain">${totalGain.toLocaleString()}</div>
      </div>
    </div>
  );
}
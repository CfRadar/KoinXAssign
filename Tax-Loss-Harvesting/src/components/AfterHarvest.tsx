import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/apiBaseUrl";
import "../styles/AfterHarvest.css";

type AfterHarvestProps = {
    selectedHoldings: { coin: string; stcg: { gain: number; balance: number }; ltcg: { gain: number; balance: number } }[];
};

export default function AfterHarvest({ selectedHoldings }: AfterHarvestProps) {
    const [capitalGains, setCapitalGains] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/capital-gains`);
                const gainsData = await res.json();

                setCapitalGains(gainsData.capitalGains);
                // TODO: holdings and selectedCoins will be passed from the connected table component later
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    if (!capitalGains) {
        return <div className="loading-text">Loading...</div>;
    }

    let stcgProfit = capitalGains.stcg.profits;
    let stcgLoss = capitalGains.stcg.losses;
    let ltcgProfit = capitalGains.ltcg.profits;
    let ltcgLoss = capitalGains.ltcg.losses;

    // Compute base pre-harvest total gain to compare later
    const baseStcgNet = stcgProfit - stcgLoss;
    const baseLtcgNet = ltcgProfit - ltcgLoss;
    const baseTotalGain = baseStcgNet + baseLtcgNet;

    // Apply selected holdings directly
    selectedHoldings.forEach(holding => {
        if (holding.stcg.gain > 0) stcgProfit += holding.stcg.gain;
        if (holding.stcg.gain < 0) stcgLoss += Math.abs(holding.stcg.gain);
        if (holding.ltcg.gain > 0) ltcgProfit += holding.ltcg.gain;
        if (holding.ltcg.gain < 0) ltcgLoss += Math.abs(holding.ltcg.gain);
    });

    const stcgNet = stcgProfit - stcgLoss;
    const ltcgNet = ltcgProfit - ltcgLoss;
    const totalGain = stcgNet + ltcgNet;

    const savedAmount = baseTotalGain - totalGain;



    return (
        <div className="after-harvest-card">
            <div className="after-title">After Harvesting</div>

            <div className="after-row after-header-row">
                <div></div>
                <div>Short-term</div>
                <div>Long-term</div>
            </div>

            <div className="after-row">
                <div className="after-row-label">Profits</div>
                <div>$ {stcgProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div>$ {ltcgProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>

            <div className="after-row">
                <div className="after-row-label">Losses</div>
                <div>- $ {stcgLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div>- $ {ltcgLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>

            <div className="after-row">
                <div className="after-row-label">Net Capital Gains</div>
                <div>$ {stcgNet.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                <div style={{ color: ltcgNet < 0 ? "#ff4d4d" : undefined }}>
                    $ {ltcgNet.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
            </div>

            <div className="after-realised-row">
                <div className="after-row-label">Realised Capital Gains:</div>
                <div className="after-total-gain">${totalGain.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>

            <div className="after-savings-container" style={{ visibility: savedAmount > 0 ? "visible" : "hidden" }}>
                    <span>🎉</span>
                    <span>You are going to save upto</span>
                    <span>$ {savedAmount.toLocaleString(undefined, { maximumFractionDigits: 10 })}</span>
                </div>


        </div>
    );
}
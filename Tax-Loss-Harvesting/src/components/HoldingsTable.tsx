import React, { useEffect, useState } from "react";
import "../styles/HoldingsTable.css";

type GainType = {
    balance: number;
    gain: number;
};

type Holding = {
    coin: string;
    coinName: string;
    logo: string;
    currentPrice: number;
    totalHolding: number;
    averageBuyPrice: number;
    stcg: GainType;
    ltcg: GainType;
};

type SortKey = "stcg" | "ltcg" | null;

const HoldingsTable: React.FC = () => {
    const [data, setData] = useState<Holding[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: SortKey;
        direction: "asc" | "desc";
    }>({
        key: null,
        direction: "asc",
    });

    useEffect(() => {
        fetch("http://localhost:5000/api/holdings")
            .then((res) => res.json())
            .then((res: Holding[]) => setData(res))
            .catch((err) => console.error(err));
    }, []);

    const handleSort = (key: "stcg" | "ltcg") => {
        let direction: "asc" | "desc" = "asc";

        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        setSortConfig({ key, direction });

        const sorted = [...data].sort((a, b) => {
            const valA = a[key].gain;
            const valB = b[key].gain;

            return direction === "asc" ? valA - valB : valB - valA;
        });

        setData(sorted);
    };

    const toggleRow = (index: number) => {
        setSelectedRows((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const visibleData = showAll ? data : data.slice(0, 4);

    return (
        <div className="table-container">
            <h2 className="title">Holdings</h2>

            <div className="table-scroll">
                <div className="table">

                    {/* HEADER */}
                    <div className="row header">
                        <div className="checkbox-cell">
                            <input type="checkbox" />
                        </div>

                        <div className="asset">Asset</div>

                        {/* MERGED COLUMN */}
                        <div className="col right">
                            Holdings
                            <div className="sub">Avg Buy Price / Current Price</div>
                        </div>

                        <div
                            className="col right sortable"
                            onClick={() => handleSort("stcg")}
                        >
                            <span className="triangle">▲</span> Short-Term Gain
                        </div>

                        <div
                            className="col right sortable"
                            onClick={() => handleSort("ltcg")}
                        >
                            <span className="triangle">▲</span> Long-Term Gain
                        </div>

                        <div className="col right">Amount to Sell</div>
                    </div>

                    {/* BODY */}
                    <div className="body">
                        {visibleData.map((item, i) => (
                            <div key={i} className="row body-row">

                                <div className="checkbox-cell">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(i)}
                                        onChange={() => toggleRow(i)}
                                    />
                                </div>

                                <div className="asset">
                                    <img src={item.logo} alt={item.coinName} />
                                    <div>
                                        <div className="coin">{item.coinName}</div>
                                        <div className="symbol">{item.coin}</div>
                                    </div>
                                </div>

                                {/* HOLDINGS + BOTH PRICES */}
                                <div className="col right">
                                    <div>{item.totalHolding.toFixed(4)}</div>
                                    <div className="sub">
                                        $ {item.averageBuyPrice.toFixed(2)} / $ {item.currentPrice.toFixed(2)}
                                    </div>
                                </div>

                                {/* STCG */}
                                <div className="col right">
                                    <div className={item.stcg.gain >= 0 ? "profit" : "loss"}>
                                        $ {item.stcg.gain.toFixed(2)}
                                    </div>
                                    <div className="sub">
                                        {item.stcg.balance.toFixed(4)}
                                    </div>
                                </div>

                                {/* LTCG */}
                                <div className="col right">
                                    <div className={item.ltcg.gain >= 0 ? "profit" : "loss"}>
                                        $ {item.ltcg.gain.toFixed(2)}
                                    </div>
                                    <div className="sub">
                                        {item.ltcg.balance.toFixed(4)}
                                    </div>
                                </div>

                                {/* AMOUNT TO SELL */}
                                <div className="col right">
                                    {selectedRows.includes(i)
                                        ? `${item.totalHolding.toFixed(4)} ${item.coin}`
                                        : "-"}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="view-all" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : "View all"}
            </div>
        </div>
    );
};

export default HoldingsTable;
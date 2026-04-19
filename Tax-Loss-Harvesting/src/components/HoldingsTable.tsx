import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type HoldingsTableProps = {
    onSelectionChange?: (selectedHoldings: Holding[]) => void;
};

const formatDollarExact = (value: number) => {
    const sign = value < 0 ? "-" : "";
    const absoluteValue = Math.abs(value);

    return `${sign}$${absoluteValue.toLocaleString("en-US", {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    })}`;
};

type NumberWithTooltipProps = {
    displayValue: string;
    tooltipValue: string;
    className?: string;
};

const NumberWithTooltip: React.FC<NumberWithTooltipProps> = ({
    displayValue,
    tooltipValue,
    className,
}) => {
    const triggerRef = useRef<HTMLSpanElement | null>(null);
    const hideTimerRef = useRef<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    const updatePosition = () => {
        if (!triggerRef.current) {
            return;
        }

        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
            left: rect.left + rect.width / 2,
            top: rect.top,
        });
    };

    const clearHideTimer = () => {
        if (hideTimerRef.current !== null) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };

    const showTooltip = () => {
        clearHideTimer();
        updatePosition();
        setIsVisible(true);
    };

    const hideTooltip = () => {
        clearHideTimer();
        hideTimerRef.current = window.setTimeout(() => {
            setIsVisible(false);
        }, 120);
    };

    useEffect(() => {
        if (!isVisible) {
            return;
        }

        const handleReposition = () => updatePosition();

        window.addEventListener("scroll", handleReposition, true);
        window.addEventListener("resize", handleReposition);

        return () => {
            window.removeEventListener("scroll", handleReposition, true);
            window.removeEventListener("resize", handleReposition);
        };
    }, [isVisible]);

    useEffect(() => {
        return () => clearHideTimer();
    }, []);

    return (
        <div className={className}>
            <span
                ref={triggerRef}
                className="value-tooltip-trigger"
                tabIndex={0}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {displayValue}
            </span>
            {isVisible && createPortal(
                <span
                    className="value-tooltip value-tooltip-visible"
                    role="tooltip"
                    style={{ left: `${position.left}px`, top: `${position.top}px` }}
                    onMouseEnter={showTooltip}
                    onMouseLeave={hideTooltip}
                >
                    {tooltipValue}
                </span>,
                document.body,
            )}
        </div>
    );
};

const HoldingsTable: React.FC<HoldingsTableProps> = ({ onSelectionChange }) => {
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
        setSelectedRows((prev) => {
            const next = prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index];
            if (onSelectionChange) {
                onSelectionChange(next.map((i) => data[i]));
            }
            return next;
        });
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
                            <span
                                className="sort-arrow"
                                style={{
                                    transform: sortConfig.key === "stcg" && sortConfig.direction === "desc" ? "rotate(180deg)" : "rotate(0deg)",
                                    opacity: sortConfig.key === "stcg" ? 1 : 0.35,
                                }}
                            >▲</span> Short-Term Gain
                        </div>

                        <div
                            className="col right sortable"
                            onClick={() => handleSort("ltcg")}
                        >
                            <span
                                className="sort-arrow"
                                style={{
                                    transform: sortConfig.key === "ltcg" && sortConfig.direction === "desc" ? "rotate(180deg)" : "rotate(0deg)",
                                    opacity: sortConfig.key === "ltcg" ? 1 : 0.35,
                                }}
                            >▲</span> Long-Term Gain
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
                                    <NumberWithTooltip
                                        displayValue={item.totalHolding.toFixed(4)}
                                        tooltipValue={formatDollarExact(item.totalHolding * item.currentPrice)}
                                    />
                                    <div className="sub">
                                        $ {item.averageBuyPrice.toFixed(2)} / $ {item.currentPrice.toFixed(2)}
                                    </div>
                                </div>

                                {/* STCG */}
                                <div className="col right">
                                    <NumberWithTooltip
                                        className={item.stcg.gain >= 0 ? "profit" : "loss"}
                                        displayValue={`$ ${item.stcg.gain.toFixed(2)}`}
                                        tooltipValue={formatDollarExact(item.stcg.gain)}
                                    />
                                    <div className="sub">
                                        {item.stcg.balance.toFixed(4)}
                                    </div>
                                </div>

                                {/* LTCG */}
                                <div className="col right">
                                    <NumberWithTooltip
                                        className={item.ltcg.gain >= 0 ? "profit" : "loss"}
                                        displayValue={`$ ${item.ltcg.gain.toFixed(2)}`}
                                        tooltipValue={formatDollarExact(item.ltcg.gain)}
                                    />
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
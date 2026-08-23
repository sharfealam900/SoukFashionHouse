import React from "react";

export default function TopTicker() {
    const items = [
        "ELEGANT ESSENTIALS",
        "TIMELESS CRAFT",
        "QUALITY FABRICS",
        "HANDPICKED COLLECTION",
        "MODERN MODESTY",
        "EFFORTLESS STYLE",
    ];

    return (
        <div className="luxury-ticker">
            <div className="luxury-ticker-track">
                {[...items, ...items].map((item, index) => (
                    <React.Fragment key={`${item}-${index}`}>
                        <span className="luxury-ticker-item">
                            {item}
                        </span>

                        <span className="luxury-ticker-separator">
                            ◆
                        </span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}


export default function TopTicker() {
    return (
        <section className="top-ticker">
            <div className="ticker">
                <div className="ticker-track">

                    {[...Array(2)].map((_, i) => (
                        <div className="ticker-group" key={i}>
                            <span>Elegant</span>
                            <span>✦</span>

                            <span>Timeless</span>
                            <span>✦</span>

                            <span>Quality Fashion</span>
                            <span>✦</span>

                            <span>Handpicked Fabric</span>
                            <span>✦</span>

                            <span>Trendy</span>
                            <span>✦</span>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}
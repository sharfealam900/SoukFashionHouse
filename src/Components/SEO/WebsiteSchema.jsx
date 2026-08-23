export default function WebsiteSchema() {
    const SITE_URL =
        import.meta.env.VITE_SITE_URL ||
        "https://www.soukfashionhouse.com";

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",

        name: "Souk Fashion House",

        url: SITE_URL,
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema),
            }}
        />
    );
}
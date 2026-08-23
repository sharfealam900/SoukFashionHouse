export default function OrganizationSchema() {
    const SITE_URL =
        import.meta.env.VITE_SITE_URL ||
        "https://www.soukfashionhouse.com";

    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",

        name: "Souk Fashion House",

        url: SITE_URL,

        logo: `${SITE_URL}/logo.jpg`,

        sameAs: [
            // Add your real social media URLs here
            // "https://www.instagram.com/your-account",
            // "https://www.facebook.com/your-account",
        ],
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
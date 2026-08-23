import fs from "fs";
import path from "path";

const SITE_URL =
    process.env.VITE_SITE_URL ||
    "https://www.soukfashionhouse.com";

const API_URL =
    process.env.VITE_API_URL ||
    "http://localhost:8000/api/v1";

const PUBLIC_DIR = path.resolve("public");

const staticRoutes = [
    "/",
    "/shop",
    "/about",
    "/contact",
    "/blog",
    "/story",
    "/privacy-policy",
];

async function getProducts() {
    try {
        const response = await fetch(
            `${API_URL}/products`
        );

        if (!response.ok) {
            throw new Error(
                `Products API returned ${response.status}`
            );
        }

        const data = await response.json();

        return data.products || [];
    } catch (error) {
        console.error(
            "❌ Failed to fetch products:",
            error.message
        );

        return [];
    }
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function createUrlEntry(
    url,
    priority = "0.7"
) {
    return `
    <url>
        <loc>${escapeXml(url)}</loc>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
    </url>`;
}

async function generateSitemap() {
    console.log("🔎 Generating sitemap...");

    const products = await getProducts();

    const urls = [];

    staticRoutes.forEach((route) => {
        let priority = "0.6";

        if (route === "/") {
            priority = "1.0";
        }

        if (route === "/shop") {
            priority = "0.9";
        }

        urls.push(
            createUrlEntry(
                `${SITE_URL}${route}`,
                priority
            )
        );
    });

    products.forEach((product) => {
        if (!product?.slug) {
            return;
        }

        if (product.isActive === false) {
            return;
        }

        urls.push(
            createUrlEntry(
                `${SITE_URL}/products/${product.slug}`,
                "0.8"
            )
        );
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls.join("\n")}
</urlset>
`;

    fs.mkdirSync(PUBLIC_DIR, {
        recursive: true,
    });

    const sitemapPath = path.join(
        PUBLIC_DIR,
        "sitemap.xml"
    );

    fs.writeFileSync(
        sitemapPath,
        sitemap,
        "utf8"
    );

    console.log(
        `✅ Sitemap generated successfully: ${urls.length} URLs`
    );

    console.log(
        `📄 ${sitemapPath}`
    );
}

generateSitemap();
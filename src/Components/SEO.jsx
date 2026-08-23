import { Helmet } from "react-helmet-async";

const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  "https://www.soukfashionhouse.com";

const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

export default function SEO({
  title = "Souk Fashion House | Elegant Fashion & Modern Modesty",
  description = "Discover elegant fashion, handcrafted designs, premium fabrics and modern modest wear at Souk Fashion House.",
  keywords = "Souk Fashion House, women's fashion, modest fashion, kurtis, shawls, dupattas, ethnic wear",
  image = DEFAULT_IMAGE,
  url,
  noIndex = false,
  type = "website",
}) {
  const currentPath =
    url || window.location.pathname;

  const canonicalUrl = currentPath.startsWith("http")
    ? currentPath
    : `${SITE_URL}${currentPath}`;

  return (
    <Helmet>
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="keywords"
        content={keywords}
      />

      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow"
        }
      />

      <link
        rel="canonical"
        href={canonicalUrl}
      />

      <meta
        property="og:type"
        content={type}
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:image"
        content={image}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:site_name"
        content="Souk Fashion House"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={image}
      />
    </Helmet>
  );
}
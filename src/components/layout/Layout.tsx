import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from './Header';
import { Footer } from './Footer';
import { useI18n } from '../../i18n';
import { useSite } from '../../hooks/useSite';
import { usePageTracking } from '../../hooks/usePageTracking';
import { BackToTop } from '../ui/BackToTop';
import { ScrollProgress } from '../ui/ScrollProgress';
import { ParallaxDriver } from '../../hooks/useParallax';
import { JsonLd } from '../ui/JsonLd';
import { orgJsonLd, webSiteJsonLd } from '../../config/structured-data';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
}

function toAbsolute(url: string, base: string): string {
  return url.startsWith('http') ? url : `${base}${url}`;
}

export function Layout({
  children,
  title,
  description,
  canonical,
  ogImage,
  ogImageAlt,
  noIndex = false,
}: LayoutProps) {
  const { locale, dir } = useI18n();
  const { site } = useSite();
  const pageTitle = title || site.name;
  const pageDescription = description || site.description[locale];
  const pageCanonical = canonical ? `${site.url}${canonical}` : site.url;
  const pageOgImage = toAbsolute(ogImage || site.ogImage, site.url);

  usePageTracking();

  return (
    <>
      <Helmet>
        <html lang={locale} dir={dir} />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#375378" />
        <link rel="canonical" href={pageCanonical} />

        {noIndex && <meta name="robots" content="noindex, nofollow" />}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageCanonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageOgImage} />
        <meta property="og:image:alt" content={ogImageAlt || site.name} />
        <meta property="og:locale" content={locale === 'ar' ? 'ar_SA' : 'en_US'} />
        <meta property="og:locale:alternate" content={locale === 'ar' ? 'en_US' : 'ar_SA'} />
        <meta property="og:site_name" content={site.name} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageOgImage} />
      </Helmet>

      <JsonLd data={orgJsonLd()} />
      <JsonLd data={webSiteJsonLd(locale)} />

      <ParallaxDriver />
      <ScrollProgress />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-grow pt-16 lg:pt-20" role="main">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}
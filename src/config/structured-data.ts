import { siteConfig } from './site';

const baseUrl = siteConfig.url;

export function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: `${baseUrl}/`,
    logo: `${baseUrl}/Logo.png`,
    description:
      'نحوّل الأفكار إلى حلول تقنية عملية. تطوير المواقع والتطبيقات والأنظمة البرمجية المصممة لتلبية احتياجات الأعمال.',
    email: siteConfig.contact.email,
    telephone: `+${siteConfig.contact.phoneRaw}`,
    founder: {
      '@type': 'Person',
      name: 'Eng. Ayham Seif',
      jobTitle: 'Founder',
    },
    knowsAbout: [
      'Web Development',
      'Mobile App Development',
      'Custom Software Development',
      'Systems Integration',
      'Cloud & Offline Solutions',
    ],
  };
}

export function webSiteJsonLd(locale: string = 'ar') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: `${baseUrl}/`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    inLanguage: locale === 'ar' ? 'ar' : 'en',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  };
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };
}

interface SoftwareAppProps {
  name: string;
  url: string;
  image?: string;
  description: string;
  operatingSystem: string;
  offersPrice?: number;
  offersCurrency?: string;
}

export function softwareAppJsonLd(props: SoftwareAppProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: props.name,
    url: `${baseUrl}${props.url}`,
    image: props.image ? `${baseUrl}${props.image}` : `${baseUrl}/og-image.png`,
    description: props.description,
    operatingSystem: props.operatingSystem,
    applicationCategory: 'BusinessApplication',
    ...(props.offersPrice !== undefined
      ? {
          offers: {
            '@type': 'Offer',
            price: props.offersPrice,
            priceCurrency: props.offersCurrency || 'SYP',
          },
        }
      : {}),
  };
}

interface FaqItem {
  q: string;
  a: string;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };
}
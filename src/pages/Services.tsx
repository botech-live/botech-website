import { Layout } from '@/components/layout/Layout';
import { Services } from '@/components/sections/Services';
import { WhyBOTech } from '@/components/sections/WhyBOTech';
import { CTA } from '@/components/sections/CTA';
import { useI18n } from '@/i18n';
import { pageSEO } from '@/config/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { breadcrumbJsonLd } from '@/config/structured-data';
import { siteConfig } from '@/config/site';

export function ServicesPage() {
  const { t, locale } = useI18n();
  const seo = locale === 'ar' ? pageSEO.services : pageSEO.servicesEn;

  return (
    <Layout 
      title={seo.title}
      description={seo.description}
      canonical={seo.canonical}
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { label: siteConfig.navigation.main[0].label[locale], href: '/' },
          { label: siteConfig.navigation.main.find((n) => n.key === 'services')!.label[locale], href: '/services' },
        ])}
      />

      {/* Services Grid */}
      <h1 className="sr-only">{t.services.title}</h1>
      <Services />

      {/* Why BOTech */}
      <WhyBOTech />

      {/* CTA */}
      <CTA />
    </Layout>
  );
}
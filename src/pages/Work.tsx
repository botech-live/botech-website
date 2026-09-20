import { Layout } from '@/components/layout/Layout';
import { Work } from '@/components/sections/Work';
import { CTA } from '@/components/sections/CTA';
import { Section, Container } from '@/components/ui';
import { useI18n } from '@/i18n';
import { pageSEO } from '@/config/seo';
import { JsonLd } from '@/components/ui/JsonLd';
import { breadcrumbJsonLd } from '@/config/structured-data';
import { siteConfig } from '@/config/site';

export function WorkPage() {
  const { t, locale } = useI18n();
  const seo = locale === 'ar' ? pageSEO.work : pageSEO.workEn;

  return (
    <Layout 
      title={seo.title}
      description={seo.description}
      canonical={seo.canonical}
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { label: siteConfig.navigation.main[0].label[locale], href: '/' },
          { label: siteConfig.navigation.main.find((n) => n.key === 'work')!.label[locale], href: '/work' },
        ])}
      />

      {/* Work Grid */}
      <h1 className="sr-only">{siteConfig.navigation.main.find((n) => n.key === 'work')!.label[locale]}</h1>
      <Work showHeader={false} />

      {/* Additional Projects Note */}
      <Section size="md" background="neutral">
        <Container>
          <div className="text-center">
            <p className="body text-neutral-600 mb-6">
              {locale === 'ar' 
                ? 'مشاريع أخرى قيد التطوير. تواصل معنا لمعرفة المزيد.' 
                : 'More projects in development. Contact us to learn more.'
              }
            </p>
            <a href="/contact#form" className="btn btn-primary inline-flex">
              {t.common.contactUs}
            </a>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <CTA />
    </Layout>
  );
}
import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Products } from '@/components/sections/Products';
import { WhyBOTech } from '@/components/sections/WhyBOTech';
import { Work } from '@/components/sections/Work';
import { CTA } from '@/components/sections/CTA';
import { pageSEO } from '@/config/seo';

export function Home() {
  const seo = pageSEO.home;

  return (
    <Layout 
      title={seo.title}
      description={seo.description}
      canonical={seo.canonical}
      ogImage={seo.ogImage}
      ogImageAlt="Blue Orbit Technologies – Practical technology solutions for your business"
    >
      <Hero />
      <Services />
      <Products />
      <WhyBOTech />
      <Work />
      <CTA />
    </Layout>
  );
}
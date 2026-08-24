import {
  BannerCarousel,
  CardGrid,
  CtaSection,
  DealerLocatorSection,
  MastheadBanner,
  ModelCard,
  SiteFooter,
  SiteHeader,
  SpecCompareTable,
} from '../components/organisms';
import type { SiteFooterColumn, SiteHeaderNavLink } from '../components/organisms';
import {
  SAMPLE_DEALERS,
  SAMPLE_MODELS,
  SAMPLE_SPECS,
} from '../components/data';
import type { SectionDef } from '../../../playground/Section';

const NAV_LINKS: SiteHeaderNavLink[] = [
  { label: 'Scooters', active: true },
  { label: 'Charging' },
  { label: 'Ownership' },
  { label: 'Atlas World' },
  { label: 'Support' },
];

const FOOTER_COLUMNS: SiteFooterColumn[] = [
  { title: 'Scooters', links: SAMPLE_MODELS.map((m) => ({ label: m.name })) },
  {
    title: 'Ownership',
    links: [
      { label: 'Charging network' },
      { label: 'Service & warranty' },
      { label: 'EMI calculator' },
      { label: 'Accessories' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Atlas' },
      { label: 'Press' },
      { label: 'Careers' },
      { label: 'Contact us' },
    ],
  },
];

export const ATLAS_ORGANISM_SECTIONS: SectionDef[] = [
  {
    id: 'site-header',
    title: 'SiteHeader',
    description:
      'Utility bar (dealer locator + phone) over the main nav row; the transparent variant overlays a dark masthead.',
    render: () => (
      <div style={{ display: 'grid', gap: 24 }}>
        <SiteHeader navLinks={NAV_LINKS} phone="1800 103 5292" />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
            <SiteHeader
              variant="transparent"
              navLinks={NAV_LINKS}
              phone="1800 103 5292"
            />
          </div>
          <MastheadBanner
            media="image"
            inverse
            headingSize="2xl"
            eyebrow="New"
            title="Atlas V2 Pro"
            subtitle="165 km certified range. 90 km/h top speed."
            ctaLabel="Book test ride"
          />
        </div>
      </div>
    ),
  },
  {
    id: 'masthead-banner',
    title: 'MastheadBanner',
    description:
      'Eyebrow chip, huge headline, sub copy, CTA row — image, video and plain media variants.',
    render: () => (
      <div style={{ display: 'grid', gap: 24 }}>
        <MastheadBanner
          media="image"
          inverse
          align="left"
          headingSize="3xl"
          eyebrow="The flagship"
          title="Ride the future of urban mobility"
          subtitle="The Atlas V2 Pro pairs a 3.94 kWh removable battery with a 90 km/h top speed — and charges from any household socket."
          ctaLabel="Book test ride"
          linkLabel="Explore V2 Pro"
        />
        <MastheadBanner
          media="video"
          inverse
          align="center"
          headingSize="2xl"
          eyebrow="Film"
          title="Making of the V2"
          subtitle="Three years, 900 prototypes, one scooter."
          linkLabel="Watch the film"
        />
        <MastheadBanner
          media="plain"
          align="center"
          headingSize="2xl"
          eyebrow="Offers"
          title="Own a Atlas from ₹2,999/month"
          subtitle="Flexible EMI plans with tenures from 12 to 48 months."
          ctaLabel="Calculate EMI"
          linkLabel="See all offers"
        />
      </div>
    ),
  },
  {
    id: 'banner-carousel',
    title: 'BannerCarousel',
    description:
      'Scroll-snap slide strip with prev/next controls and dot indicators — no autoplay.',
    render: () => (
      <BannerCarousel
        label="Offers and launches"
        slides={[
          <MastheadBanner
            key="offer"
            media="image"
            inverse
            headingSize="2xl"
            eyebrow="Launch offer"
            title="₹10,000 off the V2 Plus"
            subtitle="Limited-period exchange bonus on all bookings this month."
            ctaLabel="Book now"
          />,
          <MastheadBanner
            key="charging"
            media="plain"
            headingSize="2xl"
            eyebrow="Charging"
            title="3,500+ charging points"
            subtitle="Fast-charge mid-ride on the Atlas network."
            linkLabel="Find a charger"
          />,
          <MastheadBanner
            key="test-ride"
            media="image"
            inverse
            headingSize="2xl"
            eyebrow="Test ride"
            title="Feel it to believe it"
            subtitle="20 minutes on a V2 Pro at a hub near you."
            ctaLabel="Book test ride"
          />,
        ]}
      />
    ),
  },
  {
    id: 'spec-compare-table',
    title: 'SpecCompareTable',
    description:
      'Model columns × spec rows from the fixtures — brand highlight on the flagship.',
    render: () => (
      <SpecCompareTable
        models={SAMPLE_MODELS.map((m) => ({
          id: m.id,
          name: m.name,
          price: m.price,
          tag: m.tag,
        }))}
        rows={SAMPLE_SPECS}
        highlightId="v2-pro"
        caption="IDC-certified figures; real-world range varies with riding mode."
      />
    ),
  },
  {
    id: 'card-grid',
    title: 'CardGrid · ModelCard',
    description:
      'Responsive 2/3/4-column grid wrapper with the built-in range model cards.',
    render: () => (
      <CardGrid columns={4}>
        {SAMPLE_MODELS.map((m) => (
          <ModelCard key={m.id} model={m} />
        ))}
      </CardGrid>
    ),
  },
  {
    id: 'dealer-locator-section',
    title: 'DealerLocatorSection',
    description:
      'Search + city filters, dealer-card list on the left, map placeholder panel on the right.',
    render: () => (
      <DealerLocatorSection
        subtitle="3 hubs within 12 km of Indiranagar, Bengaluru"
        dealers={SAMPLE_DEALERS}
      />
    ),
  },
  {
    id: 'cta-section',
    title: 'CtaSection',
    description: 'Full-width conversion band — brand orange and solid ink tones.',
    render: () => (
      <div style={{ display: 'grid', gap: 24 }}>
        <CtaSection
          tone="brand"
          title="Feel the thrill. Book a test ride."
          body="20 minutes on a V2 Pro will change how you think about commuting."
          primaryLabel="Book test ride"
          secondaryLabel="Find a dealer"
        />
        <CtaSection
          tone="ink"
          title="Own a Atlas from ₹2,999/month"
          body="Flexible EMI plans through our finance partners."
          primaryLabel="Calculate EMI"
        />
      </div>
    ),
  },
  {
    id: 'site-footer',
    title: 'SiteFooter',
    description:
      'Dark footer — brand block, link columns, social row and the legal strip.',
    render: () => (
      <SiteFooter
        tagline="Electric scooters engineered by Atlas Motors for the everyday commute."
        columns={FOOTER_COLUMNS}
        socials={[
          { label: 'Instagram' },
          { label: 'YouTube' },
          { label: 'X' },
          { label: 'LinkedIn' },
        ]}
        legalLinks={[
          { label: 'Privacy policy' },
          { label: 'Terms of use' },
          { label: 'Cookie policy' },
        ]}
      />
    ),
  },
];

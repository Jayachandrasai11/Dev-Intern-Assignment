import { useState } from 'react';
import {
  AccordionItem,
  AdvantageCard,
  AwardCard,
  Breadcrumb,
  DealerCard,
  EmiRow,
  NavTabs,
  NotificationBanner,
  PriceTag,
  SpecCard,
} from '../components/molecules';
import {
  SAMPLE_AWARDS,
  SAMPLE_DEALERS,
  SAMPLE_FAQS,
  SAMPLE_MODELS,
} from '../components/data';
import type { SectionDef } from '../../../playground/Section';

const PRO = SAMPLE_MODELS[0];

export const ATLAS_MOLECULE_SECTIONS: SectionDef[] = [
  {
    id: 'spec-card',
    title: 'SpecCard',
    description: 'Model-page spec stats — icon, big value, unit, caption.',
    render: () => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <SpecCard icon="map-pin" value={String(PRO.rangeKm)} unit="km" label="Certified range" />
        <SpecCard icon="gauge" value={String(PRO.topSpeedKmh)} unit="km/h" label="Top speed" />
        <SpecCard icon="battery" value={String(PRO.batteryKwh)} unit="kWh" label="Removable battery" />
        <SpecCard icon="bolt" value={PRO.chargeTime} label="Full charge at home" />
      </div>
    ),
  },
  {
    id: 'advantage-card',
    title: 'AdvantageCard',
    description: 'The "advantage" grid units — icon tile, title, body copy.',
    render: () => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <AdvantageCard icon="battery" title="Removable batteries">
          Two swappable packs charge from any 5A socket — at home, at work, or
          at 3,500+ charging points.
        </AdvantageCard>
        <AdvantageCard icon="bolt" title="Fast, everywhere charging">
          65% in about 3.5 hours on a household socket, or top up mid-ride on
          the Atlas fast-charging network.
        </AdvantageCard>
        <AdvantageCard icon="gauge" title="Ride modes that adapt">
          Eco, Ride, Sport and a custom mode tune throttle and regen to squeeze
          the most from every charge.
        </AdvantageCard>
      </div>
    ),
  },
  {
    id: 'accordion-item',
    title: 'AccordionItem',
    description: 'FAQ rows — question, rotating chevron, answer.',
    render: () => (
      <div style={{ maxWidth: 620 }}>
        {SAMPLE_FAQS.map((faq, i) => (
          <AccordionItem key={faq.q} question={faq.q} answer={faq.a} defaultOpen={i === 0} />
        ))}
      </div>
    ),
  },
  {
    id: 'nav-tabs',
    title: 'NavTabs',
    description: 'Model-page tab strip — brand-orange underline on the active tab.',
    render: () => <NavTabsDemo />,
  },
  {
    id: 'dealer-card',
    title: 'DealerCard',
    description: 'Dealer-locator results — open state chip, distance, call CTA.',
    render: () => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {SAMPLE_DEALERS.map((d) => (
          <DealerCard
            key={d.id}
            name={d.name}
            address={d.address}
            city={d.city}
            distanceKm={d.distanceKm}
            open={d.open}
            phone={d.phone}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'breadcrumb',
    title: 'Breadcrumb',
    description: 'Chevron-separated trail; the last item is the current page.',
    render: () => (
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Electric scooters', href: '#' },
          { label: 'Atlas V2 Pro' },
        ]}
      />
    ),
  },
  {
    id: 'notification-banner',
    title: 'NotificationBanner',
    description: 'Full-width status banners — offers, confirmations, outages.',
    render: () => (
      <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
        <NotificationBanner tone="info">
          <strong>FAME-II subsidy</strong> — prices shown include all central
          incentives for your state.
        </NotificationBanner>
        <NotificationBanner tone="success" onDismiss={() => {}}>
          Test ride booked — see you at Atlas Hub Indiranagar on Saturday, 10 am.
        </NotificationBanner>
        <NotificationBanner tone="warning">
          High demand: V2 Pro deliveries in Bengaluru are running 2–3 weeks out.
        </NotificationBanner>
        <NotificationBanner tone="error" onDismiss={() => {}}>
          Payment could not be processed. No amount was deducted — please retry.
        </NotificationBanner>
      </div>
    ),
  },
  {
    id: 'award-card',
    title: 'AwardCard',
    description: 'Press-strip units from the awards fixture.',
    render: () => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {SAMPLE_AWARDS.map((a) => (
          <AwardCard key={`${a.outlet}-${a.year}`} title={a.title} outlet={a.outlet} year={a.year} />
        ))}
      </div>
    ),
  },
  {
    id: 'price-tag',
    title: 'PriceTag',
    description: 'Big price, strikethrough compare, EMI hint — m and l sizes.',
    render: () => (
      <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <PriceTag
          size="l"
          price={PRO.price}
          comparePrice="₹1,45,000"
          emiHint="EMI from ₹2,999/month"
        />
        <PriceTag size="m" price={SAMPLE_MODELS[2].price} emiHint="EMI from ₹2,199/month" />
        <PriceTag size="m" price={SAMPLE_MODELS[3].price} comparePrice="₹1,10,000" />
      </div>
    ),
  },
  {
    id: 'emi-row',
    title: 'EmiRow',
    description: 'EMI / savings calculator rows — highlight marks the total.',
    render: () => (
      <div style={{ maxWidth: 380 }}>
        <EmiRow label="Ex-showroom price" value={PRO.price} />
        <EmiRow label="Down payment" value="₹15,000" />
        <EmiRow label="Tenure" value="36 months" />
        <EmiRow label="Interest rate" value="9.5% p.a." />
        <EmiRow label="Monthly EMI" value="₹2,999" highlight />
      </div>
    ),
  },
];

function NavTabsDemo() {
  const [active, setActive] = useState('overview');
  return (
    <NavTabs
      items={[
        { id: 'overview', label: 'Overview' },
        { id: 'specs', label: 'Specifications' },
        { id: 'compare', label: 'Compare' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'faq', label: 'FAQ' },
      ]}
      activeId={active}
      onChange={setActive}
    />
  );
}

import React, { useRef, useState } from 'react';
import { Icon } from '../atoms';

export interface BannerCarouselProps {
  /** Slides; alternatively pass children. */
  slides?: React.ReactNode[];
  children?: React.ReactNode;
  /** Accessible label for the carousel region. */
  label?: string;
}

/** Horizontally scrollable banner strip — prev/next controls and dot
 *  indicators. Visual only: no autoplay. */
export function BannerCarousel({
  slides,
  children,
  label = 'Promotions',
}: BannerCarouselProps) {
  const items = slides ?? React.Children.toArray(children);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    setActive(next);
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: next * track.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="atlas-carousel"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="atlas-carousel__viewport">
        <div className="atlas-carousel__track" ref={trackRef}>
          {items.map((slide, i) => (
            <div
              key={i}
              className="atlas-carousel__slide"
              aria-hidden={i !== active}
            >
              {slide}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="atlas-carousel__control atlas-carousel__control--prev"
          aria-label="Previous slide"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
        >
          <Icon name="chevron-right" size={18} />
        </button>
        <button
          type="button"
          className="atlas-carousel__control atlas-carousel__control--next"
          aria-label="Next slide"
          onClick={() => goTo(active + 1)}
          disabled={active === items.length - 1}
        >
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
      <div className="atlas-carousel__dots">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active ? true : undefined}
            className={`atlas-carousel__dot${
              i === active ? ' atlas-carousel__dot--active' : ''
            }`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

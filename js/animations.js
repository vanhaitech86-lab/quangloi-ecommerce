/**
 * QUANG LỢI E-COMMERCE - GSAP & SCROLLTRIGGER ANIMATIONS
 * Advanced smooth page reveals, Staggers & Parallax Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS (Animate On Scroll) if loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }

  // 2. Initialize GSAP & ScrollTrigger
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Section Entrance Sequence
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (document.querySelector('.hero-headline')) {
      heroTl
        .from('.hero-badge-tag', {
          opacity: 0,
          y: -20,
          duration: 0.6,
          delay: 0.2
        })
        .from('.hero-headline', {
          opacity: 0,
          y: 35,
          duration: 0.9
        }, '-=0.3')
        .from('.hero-subheadline', {
          opacity: 0,
          y: 25,
          duration: 0.7
        }, '-=0.4')
        .from('.hero-cta-group', {
          opacity: 0,
          y: 20,
          duration: 0.6
        }, '-=0.3')
        .from('.hero-stat-card', {
          opacity: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.7
        }, '-=0.3');
    }

    // ScrollTrigger: Category Cards Stagger
    if (document.querySelectorAll('.category-card').length && typeof ScrollTrigger !== 'undefined') {
      gsap.from('.category-card', {
        scrollTrigger: {
          trigger: '#categories-section',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        scale: 0.95,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out'
      });
    }

    // ScrollTrigger: Featured Product Cards Stagger
    if (document.querySelectorAll('.product-card').length && typeof ScrollTrigger !== 'undefined') {
      gsap.from('.featured-product-item', {
        scrollTrigger: {
          trigger: '#featured-products',
          start: 'top 75%',
        },
        opacity: 0,
        y: 45,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // ScrollTrigger: Why Choose Us Feature Cards
    if (document.querySelectorAll('.feature-box').length && typeof ScrollTrigger !== 'undefined') {
      gsap.from('.feature-box', {
        scrollTrigger: {
          trigger: '#why-us-section',
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        stagger: 0.15,
        duration: 0.7,
        ease: 'back.out(1.2)'
      });
    }

    // Subtle Parallax on Floating Decorative Elements
    const parallaxDecorators = document.querySelectorAll('.parallax-decor');
    if (parallaxDecorators.length && typeof ScrollTrigger !== 'undefined') {
      parallaxDecorators.forEach((el, index) => {
        const speed = (index % 2 === 0 ? 1 : -1) * 80;
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          y: speed,
          ease: 'none'
        });
      });
    }
  }
});

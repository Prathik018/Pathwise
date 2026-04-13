'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'motion/react';

const HeroSection = () => {
  const imageRef = useRef(null);
  // The scroll image effect is applied to the hero image when the user scrolls down the page.
  // This effect adds a "scrolled" class to the image when the scroll position exceedsthe image's height.
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add('scrolled');
      } else {
        imageElement.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="space-y-6 text-center"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="space-y-6 mx-auto"
        >
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl gradient-title animate-gradient">
            Your Intelligent AI Career Coach for
            <br />
            Smarter Professional Growth
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Leverage advanced AI to navigate your career path with precision,
            get personalized insights, automated interview preparation and smart
            tools engineered for job success.
          </p>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex justify-center space-x-4"
        >
          <Link href="/dashboard">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="px-6">
                Get Started!
              </Button>
            </motion.div>
          </Link>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="hero-image-wrapper mt-5 md:mt-0"
        >
          <motion.div
            ref={imageRef}
            className="hero-image"
            whileHover={{ scale: 1.01 }}
          >
            <Image
              src="/banner.png"
              width={1280}
              height={720}
              sizes="(max-width: 768px) 100vw, 1280px"
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

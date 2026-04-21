'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { motion } from 'motion/react';

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60"
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          prefetch={true}
          className="group inline-flex items-center rounded-md px-1 py-0.5"
          aria-label="Pathwise Home"
        >
          <span className="relative inline-flex items-baseline gap-1 leading-none">
            <span className="text-xl font-black tracking-wide gradient-title text-foreground md:text-3xl">
              PATHWISE
            </span>
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {mounted ? (
            <>
              <SignedIn>
                <Link href="/dashboard" prefetch={true}>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button className="items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>
              </SignedIn>

              <SignedOut>
                <SignInButton>
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10',
                      userButtonPopoverCard: 'shadow-xl',
                      userPreviewMainIdentifier: 'font-semibold',
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </SignedIn>
            </>
          ) : (
            <div className="h-10 w-[220px]" />
          )}
        </div>
      </nav>
    </motion.header>
  );
}

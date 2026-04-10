'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          prefetch={true}
          className="group inline-flex items-center rounded-md px-1 py-0.5"
          aria-label="Pathwise Home"
        >
          <span className="gradient-title logo-shimmer text-2xl md:text-3xl pb-0 pr-0 leading-none transition-transform duration-300 group-hover:scale-[1.02]">
            PATHWISE
          </span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {mounted ? (
            <>
              <SignedIn>
                <Link href="/dashboard" prefetch={true}>
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Industry Insights
                  </Button>
                  <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <StarsIcon className="h-4 w-4" />
                      <span className="hidden md:block">Growth Tools</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link
                        href="/resume"
                        prefetch={true}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Build Resume
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/ai-cover-letter"
                        prefetch={true}
                        className="flex items-center gap-2"
                      >
                        <PenBox className="h-4 w-4" />
                        Cover Letter
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/interview"
                        prefetch={true}
                        className="flex items-center gap-2"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Interview Prep
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
    </header>
  );
}

'use client';

import Link from 'next/link';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ChevronsUpDown,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  PenBox,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const shortcuts = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Industry Insights',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Build Resume',
    href: '/resume',
    icon: FileText,
  },
  {
    title: 'Cover Letter',
    href: '/ai-cover-letter',
    icon: PenBox,
  },
  {
    title: 'Interview Prep',
    href: '/interview',
    icon: GraduationCap,
  },
];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const { user } = useUser();

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Industry Insights';
    if (pathname?.startsWith('/resume')) return 'Resume Builder';
    if (pathname === '/ai-cover-letter/new') return 'Create Cover Letter';
    if (/^\/ai-cover-letter\/[a-zA-Z0-9_-]+$/.test(pathname || '')) {
      return 'My Cover Letter';
    }
    if (pathname?.startsWith('/ai-cover-letter')) return 'My Cover Letter';
    if (pathname === '/interview/mock') return 'MCQ Mock Interview';
    if (pathname?.startsWith('/interview')) return 'Interview Preparation';
    if (pathname?.startsWith('/onboarding')) return 'Onboarding';
    return 'Dashboard';
  };

  const pageTitle = getPageTitle();

  const userName = user?.fullName || user?.firstName || 'Account';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SidebarProvider
      defaultOpen
      className="h-[calc(100dvh-4rem)] overflow-hidden"
    >
      <Sidebar
        collapsible="icon"
        variant="sidebar"
        className="top-16 h-[calc(100dvh-4rem)] overflow-hidden"
      >
        <SidebarContent className="overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <SidebarGroup>
            <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {shortcuts.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/'
                      ? pathname === '/'
                      : item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname?.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold">
                          {userInitial}
                        </span>
                      )}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      <span className="truncate font-semibold">{userName}</span>
                      <span className="truncate text-xs">{userEmail}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="right"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt={userName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-semibold">
                            {userInitial}
                          </span>
                        )}
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userName}
                        </span>
                        <span className="truncate text-xs">{userEmail}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <SignOutButton redirectUrl="/">
                    <DropdownMenuItem>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </SignOutButton>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="mt-16 h-[calc(100dvh-4rem)] overflow-hidden">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="sticky top-0 z-[1] flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4"
        >
          <SidebarTrigger className="h-8 w-8" />
          <h1 className="text-base font-semibold tracking-tight">
            {pageTitle}
          </h1>
        </motion.header>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto p-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </motion.div>
      </SidebarInset>
    </SidebarProvider>
  );
}

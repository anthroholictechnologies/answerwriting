"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "answerwriting/components/ui/sidebar";
import { Button } from "answerwriting/components/ui/button";
import Image from "next/image";
import {
  User,
  LogOut,
  Brain,
  Home,
  Calculator,
  DiamondPlusIcon,
  PenToolIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "answerwriting/lib/utils";
import {
  ApiRoutePaths,
  UserDetailProp,
} from "answerwriting/types/general.types";
import { logout } from "answerwriting/actions";

// Add Home to menu items
const mainMenuItems = [
  {
    label: "Home",
    icon: Home,
    href: ApiRoutePaths.PAGE_DASHBOARD, // Assuming this is your dashboard home path
  },
];

const getProfileMenuItems = (isProUser: boolean) => [
  {
    label: "My Profile",
    icon: User,
    href: ApiRoutePaths.PAGE_DASHBOARD_USER_PROFILE,
  },
  {
    label: "Upgrade to Pro",
    icon: DiamondPlusIcon,
    href: ApiRoutePaths.PAGE_PRICING,
    hidden: isProUser,
  },
];

const aiToolsMenuItems = [
  {
    label: "Answer Evaluator",
    href: ApiRoutePaths.PAGE_DASHBOARD_TOOLS_EVALUATOR,
    icon: Brain,
  },
  {
    label: "Essay Evaluator",
    href: ApiRoutePaths.PAGE_ESSAY_EVALUATOR,
    icon: PenToolIcon,
  },
  {
    label: "Word Counter",
    href: ApiRoutePaths.PAGE_DASHBOARD_TOOLS_WORD_COUNTER, // You'll need to add this path to your types
    icon: Calculator,
  },
];

export function AppSidebar({ userDetails }: { userDetails: UserDetailProp }) {
  const pathname = usePathname();

  const MenuItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
  }) => {
    const isActive = pathname === href;

    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild disabled={true}>
          <Link
            href={href}
            className={cn(
              "flex items-center w-full p-4",
              "hover:bg-gradient-to-r hover:from-primary-dark/20 hover:to-primary-dark/10 hover:shadow-sm transition-all duration-200 ease-in-out",
              "relative overflow-hidden",
              isActive
                ? "bg-gradient-to-r from-primary-dark/20 to-primary-dark/10 shadow-sm"
                : ""
            )}
          >
            {/* Active state left accent */}
            {isActive && (
              <div className="absolute left-0 top-0 h-full w-1 bg-primary-dark rounded-r" />
            )}

            <Icon
              className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "text-primary-dark" : "text-zinc-400",
                "group-hover:scale-105"
              )}
            />

            <span
              className={cn(
                "ml-3 font-medium tracking-tight",
                isActive ? "text-primary-dark" : "text-zinc-700"
              )}
            >
              {label}
            </span>

            {/* Subtle hover/active indicator */}
            {isActive && (
              <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-dark" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-4 border-b border-zinc-200">
        <div className="relative h-12">
          <Image
            src="/logo_4.svg"
            fill
            alt="answerwriting logo"
            className="object-contain"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Home Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainMenuItems.map((item) => (
                <MenuItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Profile Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {getProfileMenuItems(!!userDetails.isProUser).map((item) => {
                return (
                  !item.hidden && (
                    <MenuItem
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                    />
                  )
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            AI Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {aiToolsMenuItems.map((item) => (
                <MenuItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-zinc-200">
        <Button
          className="flex gap-2 transition-colors duration-200"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

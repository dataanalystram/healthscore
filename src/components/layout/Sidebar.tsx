import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Database,
  Activity,
  Brain,
  FlaskConical,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const NavItem = ({ icon, label, href, active = false }: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href}>
            <Button
              variant={active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 mb-1",
                active ? "bg-secondary" : "hover:bg-secondary/50",
              )}
            >
              {icon}
              <span>{label}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar = ({ className = "" }: SidebarProps) => {
  // In a real app, you would determine the active route from router
  const activeRoute = "/dashboard";

  const mainNavItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Database size={20} />,
      label: "Data Integration Hub",
      href: "/data-integration",
    },
    {
      icon: <Activity size={20} />,
      label: "Scorecard Optimizer",
      href: "/scorecard-optimizer",
    },
    {
      icon: <Brain size={20} />,
      label: "AI Analysis",
      href: "/ai-analysis",
    },
    {
      icon: <FlaskConical size={20} />,
      label: "Simulation Sandbox",
      href: "/simulation",
    },
    {
      icon: <Users size={20} />,
      label: "Collaboration",
      href: "/collaboration",
    },
  ];

  const utilityNavItems = [
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/settings",
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Help & Support",
      href: "/help",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full w-[280px] bg-background border-r p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold">CH</span>
        </div>
        <h1 className="text-xl font-bold">Customer Health</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <nav className="space-y-1 mb-8">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={activeRoute === item.href}
            />
          ))}
        </nav>

        <div className="text-xs font-medium text-muted-foreground px-3 mb-2">
          Support
        </div>
        <nav className="space-y-1">
          {utilityNavItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={activeRoute === item.href}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <LogOut size={20} />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

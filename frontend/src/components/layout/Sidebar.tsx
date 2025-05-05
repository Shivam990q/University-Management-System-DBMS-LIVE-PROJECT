import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronLeft,
  ChevronRight,
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarClock,
  FileText,
  Settings,
  Building2,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  icon: React.ComponentType<any>;
  href: string;
  submenu?: { title: string; href: string }[];
};

const navItems: NavItem[] = [
  { 
    title: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/" 
  },
  { 
    title: "Students", 
    icon: Users, 
    href: "/students",
    submenu: [
      { title: "All Students", href: "/students" },
      { title: "Admissions", href: "/students/admissions" },
      { title: "Attendance", href: "/students/attendance" }
    ]
  },
  { 
    title: "Faculty", 
    icon: GraduationCap, 
    href: "/faculty" 
  },
  { 
    title: "Courses", 
    icon: BookOpen, 
    href: "/courses",
    submenu: [
      { title: "Course Catalog", href: "/courses" },
      { title: "Schedule", href: "/courses/schedule" }
    ]
  },
  { 
    title: "Timetable", 
    icon: CalendarClock, 
    href: "/timetable" 
  },
  { 
    title: "Examinations", 
    icon: FileText, 
    href: "/examinations" 
  },
  { 
    title: "Announcements", 
    icon: Bell, 
    href: "/announcements",
    submenu: [
      { title: "All Announcements", href: "/announcements" },
      { title: "New Announcement", href: "/announcements/new" }
    ]
  },
  { 
    title: "Departments", 
    icon: Building2, 
    href: "/departments" 
  },
  { 
    title: "Settings", 
    icon: Settings, 
    href: "/settings" 
  }
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-border transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="font-bold text-xl text-primary">ITM</div>
            <div className="font-semibold text-base">University</div>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="w-full flex justify-center">
            <div className="font-bold text-xl text-primary">ITM</div>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <Separator className="border-border" />
      
      <ScrollArea className="flex-1">
        <nav className="px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={(e) => {
                    if (item.submenu && !collapsed) {
                      e.preventDefault();
                      toggleSubmenu(item.title);
                    }
                  }}
                >
                  <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
                  {!collapsed && <span>{item.title}</span>}
                  {!collapsed && item.submenu && (
                    <ChevronRight 
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform", 
                        openSubmenus[item.title] && "rotate-90"
                      )} 
                    />
                  )}
                </Link>
                
                {!collapsed && item.submenu && openSubmenus[item.title] && (
                  <ul className="mt-1 ml-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.title}>
                        <Link
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            location.pathname === subItem.href
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="text-sm font-medium">AD</span>
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@itmu.edu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

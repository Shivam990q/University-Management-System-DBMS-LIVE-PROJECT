import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";

// Define our notification data
const notifications = [
  {
    id: 1, 
    title: "New course registration opened",
    description: "Registration for Fall 2025 courses is now open for all students.",
    time: "2 hours ago"
  },
  {
    id: 2, 
    title: "Exam results published",
    description: "End semester examination results for CSE-101 have been published.",
    time: "5 hours ago"
  },
  {
    id: 3, 
    title: "Faculty meeting scheduled",
    description: "Important faculty meeting scheduled for April 10, 2025 at 10:00 AM.",
    time: "1 day ago"
  }
];

export function Header() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  return (
    <header className="h-16 border-b border-border bg-white flex items-center px-6 z-10">
      <div className="flex-1 flex">
        {/* Search component removed */}
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto">
              {notifications.map((notification) => (
                <Link to={`/notifications/${notification.id}`} key={notification.id}>
                  <DropdownMenuItem className="cursor-pointer p-4">
                    <div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </DropdownMenuItem>
                </Link>
              ))}
            </div>
            <DropdownMenuSeparator />
            <Link to="/notifications">
              <DropdownMenuItem className="cursor-pointer justify-center font-medium text-primary">
                View all notifications
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative gap-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="text-sm font-medium">AD</span>
              </div>
              <span className="font-medium hidden sm:inline-block">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

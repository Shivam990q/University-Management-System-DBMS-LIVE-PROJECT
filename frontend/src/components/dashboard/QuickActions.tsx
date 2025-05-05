
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  BookOpen, 
  FilePlus, 
  Calendar, 
  Bell,
  BarChart3
} from "lucide-react";

interface ActionButton {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

const actions: ActionButton[] = [
  {
    label: "Add Student",
    icon: UserPlus,
    href: "/students/new",
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Add Course",
    icon: BookOpen,
    href: "/courses/new",
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Create Exam",
    icon: FilePlus,
    href: "/examinations/new",
    color: "bg-purple-100 text-purple-600",
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/timetable",
    color: "bg-orange-100 text-orange-600",
  },
  {
    label: "Announcement",
    icon: Bell,
    href: "/announcements/new",
    color: "bg-red-100 text-red-600",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
    color: "bg-indigo-100 text-indigo-600",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2 hover:bg-secondary"
              asChild
            >
              <a href={action.href}>
                <div className={`p-2 rounded-full ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium mt-1">{action.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

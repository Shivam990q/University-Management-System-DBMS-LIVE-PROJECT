
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { MoreHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
}

const notifications: ActivityItem[] = [
  {
    id: "1",
    title: "New Student Registration",
    description: "Arun Singh registered for B.Tech Computer Science program",
    timestamp: "10 minutes ago",
    type: "info",
  },
  {
    id: "2",
    title: "Exam Results Published",
    description: "End semester examination results for CSE-101 have been published",
    timestamp: "1 hour ago",
    type: "success",
  },
  {
    id: "3",
    title: "Assignment Deadline Approaching",
    description: "Reminder: Assignment for MTH-203 due in 48 hours",
    timestamp: "2 hours ago",
    type: "warning",
  },
  {
    id: "4",
    title: "Server Maintenance",
    description: "System will be unavailable on Sunday from 2 AM to 5 AM",
    timestamp: "3 hours ago",
    type: "error",
  },
  {
    id: "5",
    title: "New Faculty Member",
    description: "Dr. Priya Sharma joined the Department of Physics",
    timestamp: "5 hours ago",
    type: "info",
  },
];

const tasks: ActivityItem[] = [
  {
    id: "1",
    title: "Review Course Applications",
    description: "15 new applications pending for approval",
    timestamp: "Due today",
    type: "warning",
  },
  {
    id: "2",
    title: "Prepare Monthly Report",
    description: "Financial report for April 2025",
    timestamp: "Due tomorrow",
    type: "info",
  },
  {
    id: "3",
    title: "Schedule Faculty Meeting",
    description: "Discuss upcoming semester planning",
    timestamp: "Due in 2 days",
    type: "info",
  },
];

export function RecentActivity() {
  const [loading, setLoading] = useState(false);

  const simulateRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Card className="col-span-1 row-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="flex-1">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Stay updated with the latest events</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={simulateRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="notifications" className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <div
                  className={`h-2 w-2 mt-1.5 rounded-full ${
                    item.type === "info" ? "bg-blue-500" :
                    item.type === "success" ? "bg-green-500" :
                    item.type === "warning" ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="tasks" className="space-y-4">
            {tasks.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <div
                  className={`h-2 w-2 mt-1.5 rounded-full ${
                    item.type === "info" ? "bg-blue-500" :
                    item.type === "success" ? "bg-green-500" :
                    item.type === "warning" ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {item.timestamp}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Complete
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

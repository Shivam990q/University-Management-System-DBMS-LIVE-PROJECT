
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, Info, Check, AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const notifications = [
  {
    id: 1,
    title: "New course registration opened",
    description: "Registration for Fall 2025 courses is now open for all students.",
    time: "April 3, 2025 at 10:30 AM",
    createdAt: "2 hours ago",
    type: "info",
    read: false,
  },
  {
    id: 2,
    title: "Exam results published",
    description: "End semester examination results for CSE-101 have been published.",
    time: "April 3, 2025 at 9:00 AM",
    createdAt: "5 hours ago",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "Faculty meeting scheduled",
    description: "Important faculty meeting scheduled for April 10, 2025 at 10:00 AM.",
    time: "April 10, 2025 at 10:00 AM",
    createdAt: "1 day ago",
    type: "info",
    read: true,
  },
  {
    id: 4,
    title: "Assignment deadline approaching",
    description: "Reminder: Assignment for MTH-203 due in 48 hours",
    time: "April 5, 2025 at 11:59 PM",
    createdAt: "2 days ago",
    type: "warning",
    read: true,
  },
  {
    id: 5,
    title: "Server Maintenance",
    description: "System will be unavailable on Sunday from 2 AM to 5 AM",
    time: "April 7, 2025 from 2:00 AM to 5:00 AM",
    createdAt: "3 days ago",
    type: "error",
    read: true,
  },
  {
    id: 6,
    title: "New Faculty Member",
    description: "Dr. Priya Sharma joined the Department of Physics",
    time: "April 1, 2025",
    createdAt: "5 days ago",
    type: "info",
    read: true,
  },
  {
    id: 7,
    title: "Holiday Announcement",
    description: "University will remain closed on April 15, 2025 for National Holiday",
    time: "April 15, 2025",
    createdAt: "1 week ago",
    type: "info",
    read: true,
  },
  {
    id: 8,
    title: "Library Hours Extended",
    description: "Library will remain open until midnight during exam week (April 20-27)",
    time: "April 20-27, 2025",
    createdAt: "1 week ago",
    type: "info",
    read: true,
  },
];

export default function Notifications() {
  const getIconByType = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest events and announcements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs px-2">
            {unreadCount} unread
          </Badge>
          <Button size="sm" variant="outline">
            Mark all as read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="info">Informational</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View all your notifications in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border rounded-lg ${!notification.read ? 'bg-muted/30' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getIconByType(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unread">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Notifications you haven't read yet</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {notifications.filter(n => !n.read).map((notification) => (
                    <div key={notification.id} className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getIconByType(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informational Notifications</CardTitle>
              <CardDescription>General information and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {notifications.filter(n => n.type === 'info').map((notification) => (
                    <div key={notification.id} className={`p-4 border rounded-lg ${!notification.read ? 'bg-muted/30' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getIconByType(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Important alerts and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {notifications.filter(n => ['warning', 'error'].includes(n.type)).map((notification) => (
                    <div key={notification.id} className={`p-4 border rounded-lg ${!notification.read ? 'bg-muted/30' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {getIconByType(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

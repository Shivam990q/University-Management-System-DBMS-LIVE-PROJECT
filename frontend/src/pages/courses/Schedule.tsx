
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Download, Filter, Search, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Schedule() {
  const [view, setView] = useState("today");

  const todayCourses = [
    { id: "CSE-101", name: "Introduction to Computing", time: "09:00 - 10:00", room: "LH-1", faculty: "Dr. Rajesh Sharma", type: "Lecture" },
    { id: "MTH-103", name: "Discrete Mathematics", time: "10:00 - 11:00", room: "LH-3", faculty: "Dr. Sneha Gupta", type: "Lecture" },
    { id: "PHY-101", name: "Engineering Physics", time: "11:00 - 12:00", room: "LH-2", faculty: "Dr. Anil Kumar", type: "Lecture" },
    { id: "LUNCH", name: "Lunch Break", time: "12:00 - 13:00", room: "--", faculty: "--", type: "Break" },
    { id: "CSE-105", name: "Digital Logic Design", time: "13:00 - 14:00", room: "LH-6", faculty: "Prof. Vikram Patel", type: "Lecture" },
    { id: "CSE-107-LAB", name: "Data Structures Lab", time: "14:00 - 16:00", room: "Lab-3", faculty: "Dr. Meera Singh", type: "Lab" }
  ];

  const upcomingCourses = [
    { id: "CSE-101", name: "Introduction to Computing", date: "2025-04-05", time: "09:00 - 10:00", room: "LH-1", faculty: "Dr. Rajesh Sharma", type: "Lecture" },
    { id: "MTH-103", name: "Discrete Mathematics", date: "2025-04-05", time: "10:00 - 11:00", room: "LH-3", faculty: "Dr. Sneha Gupta", type: "Lecture" },
    { id: "PHY-101", name: "Engineering Physics", date: "2025-04-06", time: "11:00 - 12:00", room: "LH-2", faculty: "Dr. Anil Kumar", type: "Lecture" },
    { id: "CSE-103", name: "Programming with Python Lab", date: "2025-04-06", time: "14:00 - 16:00", room: "Lab-5", faculty: "Prof. Amit Verma", type: "Lab" },
    { id: "CSE-107", name: "Data Structures", date: "2025-04-07", time: "13:00 - 14:00", room: "LH-1", faculty: "Dr. Meera Singh", type: "Lecture" },
    { id: "ENG-101", name: "Technical Communication", date: "2025-04-07", time: "10:00 - 11:00", room: "LH-4", faculty: "Dr. Priya Sharma", type: "Lecture" }
  ];

  const getBadgeForType = (type: string) => {
    switch (type) {
      case "Lecture":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">{type}</Badge>;
      case "Lab":
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">{type}</Badge>;
      case "Break":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Schedule</h1>
          <p className="text-muted-foreground">
            View and manage class schedules and timetables
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="btech-cse-sem3" onValueChange={(value) => console.log(value)}>
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder="Select program & semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="btech-cse-sem1">B.Tech CSE - Semester 1</SelectItem>
              <SelectItem value="btech-cse-sem2">B.Tech CSE - Semester 2</SelectItem>
              <SelectItem value="btech-cse-sem3">B.Tech CSE - Semester 3</SelectItem>
              <SelectItem value="btech-eee-sem3">B.Tech EEE - Semester 3</SelectItem>
              <SelectItem value="btech-me-sem3">B.Tech ME - Semester 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Schedule Update</AlertTitle>
        <AlertDescription>
          All Digital Logic Design Lab sessions on Friday will be held in Lab-4 instead of Lab-2 for this week.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by course code or name..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lecture">Lecture</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue={view} onValueChange={setView} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule - April 4, 2025</CardTitle>
              <CardDescription>
                B.Tech CSE - Semester 3
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[100px_1fr_150px_100px_150px] py-3 px-4 bg-muted/50 font-medium text-sm">
                  <div>Course Code</div>
                  <div>Course Name</div>
                  <div>Time</div>
                  <div>Room</div>
                  <div>Faculty</div>
                </div>
                {todayCourses.map((course) => (
                  <div key={course.id} className={`grid grid-cols-[100px_1fr_150px_100px_150px] py-3 px-4 border-t items-center ${course.type === 'Break' ? 'bg-muted/20' : ''}`}>
                    <div className="text-sm font-medium flex items-center gap-2">
                      {course.id}
                      {getBadgeForType(course.type)}
                    </div>
                    <div className="text-sm">{course.name}</div>
                    <div className="text-sm">{course.time}</div>
                    <div className="text-sm">{course.room}</div>
                    <div className="text-sm">{course.faculty}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>
                Next 7 days schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[100px_1fr_120px_150px_100px_150px] py-3 px-4 bg-muted/50 font-medium text-sm">
                  <div>Course Code</div>
                  <div>Course Name</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Room</div>
                  <div>Faculty</div>
                </div>
                {upcomingCourses.map((course, index) => (
                  <div key={`${course.id}-${index}`} className="grid grid-cols-[100px_1fr_120px_150px_100px_150px] py-3 px-4 border-t items-center">
                    <div className="text-sm font-medium flex items-center gap-2">
                      {course.id}
                      {getBadgeForType(course.type)}
                    </div>
                    <div className="text-sm">{course.name}</div>
                    <div className="text-sm flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {course.date}
                    </div>
                    <div className="text-sm">{course.time}</div>
                    <div className="text-sm">{course.room}</div>
                    <div className="text-sm">{course.faculty}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

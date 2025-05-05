
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Download, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function Attendance() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  
  const courses = [
    { id: "CSE-101", name: "Introduction to Computing", attendance: 89 },
    { id: "MTH-103", name: "Discrete Mathematics", attendance: 92 },
    { id: "PHY-101", name: "Engineering Physics", attendance: 78 },
    { id: "ENG-101", name: "Technical Communication", attendance: 85 },
    { id: "CSE-103", name: "Programming with Python", attendance: 95 }
  ];
  
  const students = [
    { id: "STU-2022-001", name: "Rahul Sharma", roll: "CSE/22/001", status: "present", image: "/placeholder.svg" },
    { id: "STU-2022-002", name: "Priya Patel", roll: "CSE/22/002", status: "present", image: "/placeholder.svg" },
    { id: "STU-2022-003", name: "Amit Singh", roll: "CSE/22/003", status: "absent", image: "/placeholder.svg" },
    { id: "STU-2022-004", name: "Neha Gupta", roll: "CSE/22/004", status: "present", image: "/placeholder.svg" },
    { id: "STU-2022-005", name: "Vikram Verma", roll: "CSE/22/005", status: "present", image: "/placeholder.svg" },
    { id: "STU-2022-006", name: "Meera Kapoor", roll: "CSE/22/006", status: "late", image: "/placeholder.svg" },
    { id: "STU-2022-007", name: "Sanjay Kumar", roll: "CSE/22/007", status: "present", image: "/placeholder.svg" },
    { id: "STU-2022-008", name: "Kavita Sharma", roll: "CSE/22/008", status: "leave", image: "/placeholder.svg" }
  ];
  
  const markAttendance = (studentId: string, newStatus: string) => {
    toast({
      title: "Attendance Updated",
      description: `Student ${studentId} marked as ${newStatus}.`,
    });
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "destructive" | "outline" | "secondary", label: string }> = {
      present: { variant: "default", label: "Present" },
      absent: { variant: "destructive", label: "Absent" },
      late: { variant: "secondary", label: "Late" },
      leave: { variant: "outline", label: "On Leave" }
    };
    
    const config = statusConfig[status] || { variant: "outline", label: status };
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Manage and track student attendance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Select defaultValue="CSE-101">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.id}: {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="mark" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
          <TabsTrigger value="report">Attendance Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mark" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Mark Attendance</CardTitle>
                  <CardDescription>
                    CSE-101: Introduction to Computing | {format(date, "EEEE, MMMM d, yyyy")}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Mark All Present</Button>
                  <Button size="sm">Save Attendance</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_100px_1fr] md:grid-cols-[1fr_150px_1fr] py-3 px-4 bg-muted/50 font-medium text-sm">
                  <div>Student</div>
                  <div>Roll Number</div>
                  <div>Status</div>
                </div>
                {students.map((student) => (
                  <div key={student.id} className="grid grid-cols-[1fr_100px_1fr] md:grid-cols-[1fr_150px_1fr] py-3 px-4 border-t items-center">
                    <div className="text-sm flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <div className="text-sm">{student.roll}</div>
                    <div>
                      <Select 
                        defaultValue={student.status}
                        onValueChange={(value) => markAttendance(student.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="report" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Report</CardTitle>
              <CardDescription>
                Course attendance statistics for Spring 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[120px_1fr_100px] py-3 px-4 bg-muted/50 font-medium text-sm">
                  <div>Course Code</div>
                  <div>Course Name</div>
                  <div>Attendance %</div>
                </div>
                {courses.map((course) => (
                  <div key={course.id} className="grid grid-cols-[120px_1fr_100px] py-3 px-4 border-t items-center">
                    <div className="text-sm font-medium">{course.id}</div>
                    <div className="text-sm">{course.name}</div>
                    <div className="text-sm">
                      <Badge variant={course.attendance >= 85 ? "default" : course.attendance >= 75 ? "secondary" : "destructive"}>
                        {course.attendance}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Individual Student Report</h3>
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr_120px_100px] py-3 px-4 bg-muted/50 font-medium text-sm">
                    <div>Student</div>
                    <div>Roll Number</div>
                    <div>Status</div>
                  </div>
                  {students.map((student) => (
                    <div key={student.id} className="grid grid-cols-[1fr_120px_100px] py-3 px-4 border-t items-center">
                      <div className="text-sm flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={student.image} alt={student.name} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{student.name}</span>
                      </div>
                      <div className="text-sm">{student.roll}</div>
                      <div>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  Clock, 
  Download, 
  Filter, 
  Search,
  AlertCircle,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export default function Examinations() {
  const upcomingExams = [
    { id: 1, course: "CSE-101", name: "Introduction to Computing", date: "2025-04-15", time: "09:00 - 11:00", venue: "Examination Hall 1", status: "scheduled" },
    { id: 2, course: "MTH-103", name: "Discrete Mathematics", date: "2025-04-17", time: "09:00 - 11:00", venue: "Examination Hall 2", status: "scheduled" },
    { id: 3, course: "PHY-101", name: "Engineering Physics", date: "2025-04-20", time: "14:00 - 16:00", venue: "Examination Hall 1", status: "scheduled" },
    { id: 4, course: "ENG-101", name: "Technical Communication", date: "2025-04-22", time: "09:00 - 11:00", venue: "Examination Hall 3", status: "scheduled" },
    { id: 5, course: "CSE-103", name: "Programming with Python", date: "2025-04-25", time: "14:00 - 16:00", venue: "Examination Hall 2", status: "scheduled" }
  ];

  const pastExams = [
    { id: 6, course: "CSE-105", name: "Digital Logic Design", date: "2025-03-15", time: "09:00 - 11:00", venue: "Examination Hall 1", status: "completed", result: "published" },
    { id: 7, course: "CSE-107", name: "Data Structures", date: "2025-03-17", time: "09:00 - 11:00", venue: "Examination Hall 2", status: "completed", result: "published" },
    { id: 8, course: "CSE-109", name: "Database Systems", date: "2025-03-20", time: "14:00 - 16:00", venue: "Examination Hall 1", status: "completed", result: "processing" },
    { id: 9, course: "CSE-111", name: "Object Oriented Programming", date: "2025-03-22", time: "09:00 - 11:00", venue: "Examination Hall 3", status: "completed", result: "processing" },
    { id: 10, course: "MTH-101", name: "Calculus", date: "2025-03-25", time: "14:00 - 16:00", venue: "Examination Hall 2", status: "completed", result: "published" }
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
          <Badge>{upcomingExams.length + pastExams.length}</Badge>
        </div>
        <Link to="/examinations/new">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Create Examination
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search examinations..."
            className="pl-8"
          />
        </div>
        <Select defaultValue="spring-2025">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fall-2024">Fall 2024</SelectItem>
            <SelectItem value="spring-2025">Spring 2025</SelectItem>
            <SelectItem value="summer-2025">Summer 2025</SelectItem>
            <SelectItem value="fall-2025">Fall 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          Mid-semester examinations for Spring 2025 will begin on April 15, 2025. Please ensure you have your student ID card and admit card for all examinations.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
          <TabsTrigger value="past">Past Exams</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Examinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[100px_1fr_150px_150px_100px] py-3 px-4 bg-muted/50 font-medium text-sm">
                  <div>Course</div>
                  <div>Name</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Status</div>
                </div>
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="grid grid-cols-[100px_1fr_150px_150px_100px] py-3 px-4 border-t">
                    <div className="text-sm font-medium">{exam.course}</div>
                    <div className="text-sm">{exam.name}</div>
                    <div className="text-sm flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {exam.date}
                    </div>
                    <div className="text-sm flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {exam.time}
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                        {exam.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Past Examinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[100px_1fr_150px_150px_120px] py-3 px-4 bg-muted/50 font-medium text-sm">
                  <div>Course</div>
                  <div>Name</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Result Status</div>
                </div>
                {pastExams.map((exam) => (
                  <div key={exam.id} className="grid grid-cols-[100px_1fr_150px_150px_120px] py-3 px-4 border-t">
                    <div className="text-sm font-medium">{exam.course}</div>
                    <div className="text-sm">{exam.name}</div>
                    <div className="text-sm flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {exam.date}
                    </div>
                    <div className="text-sm flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {exam.time}
                    </div>
                    <div>
                      <Badge 
                        variant="outline" 
                        className={exam.result === "published" 
                          ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                        }
                      >
                        {exam.result}
                      </Badge>
                    </div>
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

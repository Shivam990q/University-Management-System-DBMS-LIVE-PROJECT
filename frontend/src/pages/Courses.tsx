
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  PlusCircle,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  semester: string;
  instructor: string;
  enrolledStudents: number;
  maxCapacity: number;
  schedule: string;
  status: "Active" | "Upcoming" | "Completed" | "Cancelled";
  type: "Core" | "Elective" | "Lab" | "Project";
}

const courses: Course[] = [
  {
    id: "1",
    code: "CSE101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    credits: 4,
    semester: "Fall 2025",
    instructor: "Dr. Rajesh Kumar",
    enrolledStudents: 120,
    maxCapacity: 150,
    schedule: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
    status: "Active",
    type: "Core",
  },
  {
    id: "2",
    code: "CSE201",
    name: "Data Structures and Algorithms",
    department: "Computer Science",
    credits: 4,
    semester: "Fall 2025",
    instructor: "Prof. Anjali Gupta",
    enrolledStudents: 95,
    maxCapacity: 120,
    schedule: "Tue, Thu 1:00 PM - 3:00 PM",
    status: "Active",
    type: "Core",
  },
  {
    id: "3",
    code: "EEE205",
    name: "Digital Electronics",
    department: "Electrical Engineering",
    credits: 3,
    semester: "Fall 2025",
    instructor: "Dr. Priya Sharma",
    enrolledStudents: 85,
    maxCapacity: 100,
    schedule: "Mon, Wed 9:00 AM - 10:30 AM",
    status: "Active",
    type: "Core",
  },
  {
    id: "4",
    code: "CSE307",
    name: "Database Management Systems",
    department: "Computer Science",
    credits: 4,
    semester: "Fall 2025",
    instructor: "Prof. Rahul Verma",
    enrolledStudents: 78,
    maxCapacity: 90,
    schedule: "Tue, Thu 9:00 AM - 11:00 AM",
    status: "Active",
    type: "Core",
  },
  {
    id: "5",
    code: "CSE401",
    name: "Machine Learning",
    department: "Computer Science",
    credits: 4,
    semester: "Fall 2025",
    instructor: "Dr. Rajesh Kumar",
    enrolledStudents: 65,
    maxCapacity: 70,
    schedule: "Mon, Wed, Fri 2:00 PM - 3:30 PM",
    status: "Active",
    type: "Elective",
  },
  {
    id: "6",
    code: "MEC301",
    name: "Fluid Mechanics",
    department: "Mechanical Engineering",
    credits: 3,
    semester: "Fall 2025",
    instructor: "Dr. Sunil Mehta",
    enrolledStudents: 70,
    maxCapacity: 80,
    schedule: "Tue, Thu 11:00 AM - 12:30 PM",
    status: "Active",
    type: "Core",
  },
  {
    id: "7",
    code: "CSE415",
    name: "Cloud Computing",
    department: "Computer Science",
    credits: 3,
    semester: "Spring 2026",
    instructor: "Prof. Anjali Gupta",
    enrolledStudents: 0,
    maxCapacity: 60,
    schedule: "Mon, Wed 11:00 AM - 12:30 PM",
    status: "Upcoming",
    type: "Elective",
  },
  {
    id: "8",
    code: "CSE203",
    name: "Object-Oriented Programming Lab",
    department: "Computer Science",
    credits: 2,
    semester: "Fall 2025",
    instructor: "Prof. Rahul Verma",
    enrolledStudents: 45,
    maxCapacity: 50,
    schedule: "Fri 1:00 PM - 5:00 PM",
    status: "Active",
    type: "Lab",
  },
];

export default function Courses() {
  const [search, setSearch] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState<string>("all");
  const [filteredType, setFilteredType] = useState<string>("all");
  const [filteredStatus, setFilteredStatus] = useState<string>("all");
  
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) || 
                          course.code.toLowerCase().includes(search.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(search.toLowerCase());
    
    const matchesDepartment = filteredDepartment === "all" || 
                              course.department === filteredDepartment;
    
    const matchesType = filteredType === "all" || 
                        course.type === filteredType;
                        
    const matchesStatus = filteredStatus === "all" || 
                          course.status === filteredStatus;
    
    return matchesSearch && matchesDepartment && matchesType && matchesStatus;
  });
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage courses, classes, and academic programs
          </p>
        </div>
        <Button className="sm:self-end whitespace-nowrap">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Course
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Course Catalog</CardTitle>
          <CardDescription>
            Browse and manage all academic courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-1 gap-4 flex-wrap">
              <div className="w-full md:w-[calc(33%-0.5rem)]">
                <Select
                  value={filteredDepartment}
                  onValueChange={setFilteredDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[calc(33%-0.5rem)]">
                <Select
                  value={filteredType}
                  onValueChange={setFilteredType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Course Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Core">Core</SelectItem>
                    <SelectItem value="Elective">Elective</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[calc(33%-0.5rem)]">
                <Select
                  value={filteredStatus}
                  onValueChange={setFilteredStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="flex-shrink-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>
                        <div>
                          {course.name}
                          <Badge variant="outline" className="ml-2">
                            {course.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{course.department}</TableCell>
                      <TableCell>{course.credits}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell className="max-w-40">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{course.schedule}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>
                              {course.enrolledStudents}/{course.maxCapacity}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full mt-1.5">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${(course.enrolledStudents / course.maxCapacity) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${course.status === "Active" && "bg-green-100 text-green-800 hover:bg-green-100"}
                            ${course.status === "Upcoming" && "bg-blue-100 text-blue-800 hover:bg-blue-100"}
                            ${course.status === "Completed" && "bg-gray-100 text-gray-800 hover:bg-gray-100"}
                            ${course.status === "Cancelled" && "bg-red-100 text-red-800 hover:bg-red-100"}
                          `}
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Course</DropdownMenuItem>
                            <DropdownMenuItem>Manage Students</DropdownMenuItem>
                            <DropdownMenuItem>View Schedule</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Cancel Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No courses found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-{filteredCourses.length}</strong> of{" "}
                <strong>{filteredCourses.length}</strong> courses
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  1
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

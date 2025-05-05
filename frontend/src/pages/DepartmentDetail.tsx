import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3, 
  School, 
  Building2, 
  Mail, 
  Phone, 
  Link2, 
  ArrowLeft, 
  Globe, 
  FileText,
  Award,
  Calendar,
  Target,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { departmentsAPI } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!id) {
        setError("Department ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await departmentsAPI.getById(id);
        setDepartment(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching department:", err);
        setError("Failed to load department. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Department not found"}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Link to="/departments" className="inline-block">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Departments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for faculty members
  const facultyMembers = [
    { id: 1, name: "Dr. Amit Kumar", designation: "Professor", specialization: "Artificial Intelligence", email: "amit.kumar@itmu.edu", image: "/placeholder.svg?1" },
    { id: 2, name: "Dr. Neha Verma", designation: "Associate Professor", specialization: "Data Science", email: "neha.verma@itmu.edu", image: "/placeholder.svg?2" },
    { id: 3, name: "Dr. Rohan Gupta", designation: "Assistant Professor", specialization: "Machine Learning", email: "rohan.gupta@itmu.edu", image: "/placeholder.svg?3" },
    { id: 4, name: "Dr. Priya Singh", designation: "Assistant Professor", specialization: "Cybersecurity", email: "priya.singh@itmu.edu", image: "/placeholder.svg?4" },
  ];

  // Mock data for courses
  const courses = [
    { id: "CSE101", name: "Introduction to Computer Science", credits: 4, semester: "Fall 2025", instructor: "Dr. Amit Kumar" },
    { id: "CSE201", name: "Data Structures and Algorithms", credits: 4, semester: "Fall 2025", instructor: "Dr. Neha Verma" },
    { id: "CSE301", name: "Database Management Systems", credits: 3, semester: "Fall 2025", instructor: "Dr. Rohan Gupta" },
    { id: "CSE401", name: "Machine Learning", credits: 4, semester: "Spring 2026", instructor: "Dr. Neha Verma" },
    { id: "CSE501", name: "Artificial Intelligence", credits: 4, semester: "Spring 2026", instructor: "Dr. Amit Kumar" },
  ];

  // Mock data for events
  const events = [
    { id: 1, title: "Technical Symposium", date: "May 15, 2025", description: "Annual technical symposium featuring research presentations and industry talks." },
    { id: 2, title: "Workshop on AI", date: "June 10-12, 2025", description: "Three-day workshop on latest advancements in Artificial Intelligence." },
    { id: 3, title: "Industry Visit", date: "July 25, 2025", description: "Visit to leading tech companies to understand industry practices." },
  ];

  // Default key areas if not provided in the API response
  const keyAreas = department.keyAreas || ["Computer Science", "Data Science", "Artificial Intelligence", "Machine Learning", "Cybersecurity"];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/departments" className="inline-block">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{department.name}</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Code: {department.code} | Established: {department.established}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Download Brochure
          </Button>
          {department.website && (
            <a href={department.website} target="_blank" rel="noopener noreferrer" className="inline-block">
              <Button>
                <Globe className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{department.description || "No description available"}</p>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Key Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {keyAreas.map((area: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-primary/5">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="faculty">
            <TabsList className="mb-4">
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faculty">
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Members</CardTitle>
                  <CardDescription>Professors and lecturers in the department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {facultyMembers.map((faculty) => (
                      <div key={faculty.id} className="flex items-start gap-4 border p-4 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={faculty.image} alt={faculty.name} />
                          <AvatarFallback>{faculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">{faculty.name}</h3>
                          <p className="text-xs text-muted-foreground">{faculty.designation}</p>
                          <p className="text-xs text-primary mt-1">{faculty.email}</p>
                          <Badge variant="outline" className="mt-2 text-xs bg-muted/30">{faculty.specialization}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>Courses Offered</CardTitle>
                  <CardDescription>Current and upcoming courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium">{course.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">Code: {course.id} | Credits: {course.credits}</p>
                          </div>
                          <Badge>{course.semester}</Badge>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-xs">{course.instructor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Workshops, seminars, and department activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="border p-4 rounded-lg">
                        <h3 className="text-sm font-medium">{event.title}</h3>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                        </div>
                        <p className="text-sm mt-2">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Head</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`/placeholder.svg?${department._id}`} alt={department.hod} />
                  <AvatarFallback className="text-xl">{department.hod ? department.hod.split(' ').map((n: string) => n[0]).join('') : 'HD'}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{department.hod || "Not assigned"}</h3>
                <p className="text-sm text-muted-foreground">Head of Department</p>
                <Badge variant="outline" className="mt-2">Professor</Badge>
                
                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{department.hodEmail || "Not available"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{department.hodPhone || "+91-xxxx-xxxxxx"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Department Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <span className="font-bold">{department.students || 0}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Faculty</span>
                  </div>
                  <span className="font-bold">{department.faculty || 0}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Courses</span>
                  </div>
                  <span className="font-bold">{department.courses || 0}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">Programs</span>
                  </div>
                  <span className="font-bold">{Array.isArray(department.programs) ? department.programs.length : 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{department.location || "Not available"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{department.contact || "Not available"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{department.email || "Not available"}</span>
                </div>
                {department.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a href={department.website} className="text-sm text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      {department.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

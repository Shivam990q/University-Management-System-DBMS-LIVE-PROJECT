
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, ChevronRight, Download, Filter, InfoIcon, Search, Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function Admissions() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const applications = [
    { id: "APP-2025-001", name: "Rahul Sharma", program: "B.Tech CSE", appliedDate: "2025-03-15", status: "pending", documents: 8 },
    { id: "APP-2025-002", name: "Priya Patel", program: "B.Tech EEE", appliedDate: "2025-03-16", status: "under_review", documents: 8 },
    { id: "APP-2025-003", name: "Amit Singh", program: "BBA", appliedDate: "2025-03-17", status: "interview_scheduled", documents: 7 },
    { id: "APP-2025-004", name: "Neha Gupta", program: "B.Tech ME", appliedDate: "2025-03-18", status: "pending", documents: 6 },
    { id: "APP-2025-005", name: "Vikram Verma", program: "M.Tech CSE", appliedDate: "2025-03-18", status: "approved", documents: 8 },
    { id: "APP-2025-006", name: "Meera Kapoor", program: "MBA", appliedDate: "2025-03-19", status: "approved", documents: 8 },
    { id: "APP-2025-007", name: "Sanjay Kumar", program: "B.Tech CE", appliedDate: "2025-03-20", status: "under_review", documents: 8 },
    { id: "APP-2025-008", name: "Kavita Sharma", program: "M.Tech EEE", appliedDate: "2025-03-21", status: "rejected", documents: 5 }
  ];

  const handleApprove = (id: string) => {
    toast({
      title: "Application Approved",
      description: `Application ${id} has been approved successfully.`,
    });
  };
  
  const statusColors: Record<string, { bg: string, text: string }> = {
    pending: { bg: "bg-yellow-50", text: "text-yellow-700" },
    under_review: { bg: "bg-blue-50", text: "text-blue-700" },
    interview_scheduled: { bg: "bg-purple-50", text: "text-purple-700" },
    approved: { bg: "bg-green-50", text: "text-green-700" },
    rejected: { bg: "bg-red-50", text: "text-red-700" }
  };
  
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      under_review: "Under Review",
      interview_scheduled: "Interview Scheduled",
      approved: "Approved",
      rejected: "Rejected"
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admissions</h1>
          <p className="text-muted-foreground">
            Manage admission applications and enrollments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            New Application
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="btech">B.Tech</SelectItem>
              <SelectItem value="mtech">M.Tech</SelectItem>
              <SelectItem value="bba">BBA</SelectItem>
              <SelectItem value="mba">MBA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="new">New Application</TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application List</CardTitle>
              <CardDescription>
                Manage and process admission applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_1fr_130px_130px_1fr] py-3 px-4 bg-muted/50 font-medium text-sm">
                  <div>Application ID</div>
                  <div>Applicant</div>
                  <div>Program</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                {applications.map((app) => (
                  <div key={app.id} className="grid grid-cols-[1fr_1fr_130px_130px_1fr] py-3 px-4 border-t items-center">
                    <div className="text-sm font-medium">{app.id}</div>
                    <div className="text-sm flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/placeholder.svg`} alt={app.name} />
                        <AvatarFallback>{app.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {app.name}
                    </div>
                    <div className="text-sm">{app.program}</div>
                    <div>
                      <Badge variant="outline" className={`${statusColors[app.status].bg} ${statusColors[app.status].text} hover:${statusColors[app.status].bg} border-${statusColors[app.status].text}/30`}>
                        {getStatusDisplay(app.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      {app.status !== 'approved' && app.status !== 'rejected' && (
                        <Button variant="outline" size="sm" onClick={() => handleApprove(app.id)}>
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 8 out of 56 applications
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Application</CardTitle>
              <CardDescription>
                Create a new admission application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Academic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="program">Program Applying For</Label>
                    <Select>
                      <SelectTrigger id="program">
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech_cse">B.Tech Computer Science</SelectItem>
                        <SelectItem value="btech_eee">B.Tech Electrical</SelectItem>
                        <SelectItem value="btech_me">B.Tech Mechanical</SelectItem>
                        <SelectItem value="btech_ce">B.Tech Civil</SelectItem>
                        <SelectItem value="bba">BBA</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Entry Semester</Label>
                    <Select>
                      <SelectTrigger id="semester">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall_2025">Fall 2025</SelectItem>
                        <SelectItem value="spring_2026">Spring 2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">Previous School/College</Label>
                  <Input id="school" placeholder="Enter name of institution" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Last Qualification</Label>
                    <Select>
                      <SelectTrigger id="qualification">
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="intermediate">Intermediate/+2</SelectItem>
                        <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage">Percentage/CGPA</Label>
                    <Input id="percentage" placeholder="Enter percentage or CGPA" />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documents</h3>
                <div className="space-y-2">
                  <Label htmlFor="photo">Photograph</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <span className="text-sm text-muted-foreground">JPG, PNG. Max size 1MB</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documents">Academic Documents</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                    <span className="text-sm text-muted-foreground">PDF only. Max size 5MB each</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>Submit Application</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

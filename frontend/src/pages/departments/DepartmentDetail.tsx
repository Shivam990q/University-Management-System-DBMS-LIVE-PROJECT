import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  Link2, 
  Building2, 
  Mail, 
  Phone, 
  ArrowLeft,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "lucide-react";
import { departmentsAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Globe } from "lucide-react";

interface Department {
  _id: string;
  name: string;
  code: string;
  established?: string;
  description?: string;
  hod?: string;
  hodEmail?: string;
  programs?: string[];
  students?: number;
  faculty?: number;
  courses?: number;
  building?: string;
  floor?: string;
  room?: string;
  contact?: string;
  email?: string;
  website?: string;
}

export default function DepartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [departmentData, setDepartmentData] = useState({
    name: "",
    code: "",
    established: "",
    hod: "",
    hodEmail: "",
    students: 0,
    faculty: 0,
    courses: 0,
    programs: "",
    description: "",
    location: "",
    contact: "",
    email: "",
    website: ""
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDepartment();
    }
  }, [id]);

  const fetchDepartment = async () => {
    try {
      setIsLoading(true);
      const data = await departmentsAPI.getById(id as string);
      setDepartment(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching department:", err);
      setError("Failed to load department details. Please try again later.");
      navigate('/departments');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDepartmentDialog = () => {
    if (!department) return;
    
    // Convert arrays to comma-separated string for editing
    const programsString = Array.isArray(department.programs) 
      ? department.programs.join(", ") 
      : department.programs || "";
      
    setDepartmentData({
      name: department.name || "",
      code: department.code || "",
      established: department.established || "",
      hod: department.hod || "",
      hodEmail: department.hodEmail || "",
      students: department.students || 0,
      faculty: department.faculty || 0,
      courses: department.courses || 0,
      programs: programsString,
      description: department.description || "",
      location: department.location || "",
      contact: department.contact || "",
      email: department.email || "",
      website: department.website || ""
    });
    
    setDepartmentDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDepartmentData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numValue = parseInt(value) || 0;
    setDepartmentData(prev => ({
      ...prev,
      [id]: numValue
    }));
  };
  
  const handleSaveDepartment = async () => {
    // Validate required fields
    if (!departmentData.name || !departmentData.code) {
      toast({
        title: "Error",
        description: "Department name and code are required.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Format the data for submission
      const formattedData = {
        ...departmentData,
        // Convert comma-separated programs to array
        programs: departmentData.programs.split(',').map(p => p.trim()),
      };
      
      await departmentsAPI.update(id as string, formattedData);
      
      toast({
        title: "Success",
        description: "Department updated successfully!"
      });
      
      // Refresh the department data
      fetchDepartment();
      
      // Close the dialog
      setDepartmentDialogOpen(false);
    } catch (error) {
      console.error("Error updating department:", error);
      toast({
        title: "Error",
        description: "Failed to update department. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteDepartment = async () => {
    try {
      setDeleting(true);
      await departmentsAPI.delete(id as string);
      
      toast({
        title: "Success",
        description: "Department deleted successfully!"
      });
      
      // Navigate back to departments list
      navigate('/departments');
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading && !department) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">Department not found</h2>
        <p className="text-muted-foreground mt-2">The department you are looking for does not exist.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/departments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Departments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/departments')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{department.name}</h1>
            <p className="text-muted-foreground">
              {department.code} | Established: {department.established}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEditDepartmentDialog}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Department</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this department? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteDepartment}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>Delete</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center h-10">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <p className="text-sm text-muted-foreground">Updating...</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Department Information</CardTitle>
                <CardDescription>General information about the department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`/placeholder.svg?${department._id}`} alt={department.name} />
                    <AvatarFallback>{department.code || 'DP'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{department.name}</h3>
                    <p className="text-sm text-muted-foreground">Code: {department.code}</p>
                    <p className="text-sm text-muted-foreground">Established: {department.established}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Programs Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(department.programs) ? department.programs.map((program: string, index: number) => (
                      <Badge key={index} variant="secondary">{program}</Badge>
                    )) : 
                    <p className="text-sm text-muted-foreground">No programs listed</p>}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{department.description || 'No description available'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{department.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{department.contact || 'Contact number not specified'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{department.email || 'Email not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={department.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {department.website || 'Website not specified'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Head of Department</CardTitle>
                <CardDescription>Current department leadership</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={`/placeholder.svg?${department.hod}`} alt={department.hod} />
                    <AvatarFallback>
                      {department.hod ? department.hod.split(' ').map((n: string) => n[0]).join('') : 'HD'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{department.hod || 'Not assigned'}</h3>
                    <p className="text-sm text-primary">{department.hodEmail || 'Email not specified'}</p>
                    <p className="text-xs text-muted-foreground mt-1">Head of Department</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                    <Users className="h-5 w-5 text-blue-500 mb-1" />
                    <p className="text-sm font-medium">{department.students || 0}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                    <GraduationCap className="h-5 w-5 text-green-500 mb-1" />
                    <p className="text-sm font-medium">{department.faculty || 0}</p>
                    <p className="text-xs text-muted-foreground">Faculty</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                    <BookOpen className="h-5 w-5 text-purple-500 mb-1" />
                    <p className="text-sm font-medium">{department.courses || 0}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Members</CardTitle>
              <CardDescription>Teaching staff in the department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Faculty listing will be implemented in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Courses Offered</CardTitle>
              <CardDescription>Academic courses by the department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Course listing will be implemented in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>Students registered in this department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Student listing will be implemented in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Department Dialog */}
      <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Computer Science & Engineering"
                  value={departmentData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Department Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., CSE"
                  value={departmentData.code}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="established">Established Year</Label>
                <Input
                  id="established"
                  placeholder="e.g., 2005"
                  value={departmentData.established}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="programs">Programs Offered</Label>
                <Input
                  id="programs"
                  placeholder="e.g., B.Tech, M.Tech, Ph.D (comma-separated)"
                  value={departmentData.programs}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Department Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the department"
                value={departmentData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hod">Head of Department</Label>
                <Input
                  id="hod"
                  placeholder="e.g., Dr. John Doe"
                  value={departmentData.hod}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hodEmail">HOD Email</Label>
                <Input
                  id="hodEmail"
                  placeholder="e.g., john.doe@university.edu"
                  value={departmentData.hodEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="students">Students Count</Label>
                <Input
                  id="students"
                  type="number"
                  placeholder="e.g., 1250"
                  value={departmentData.students}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">Faculty Count</Label>
                <Input
                  id="faculty"
                  type="number"
                  placeholder="e.g., 45"
                  value={departmentData.faculty}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="courses">Courses Count</Label>
                <Input
                  id="courses"
                  type="number"
                  placeholder="e.g., 32"
                  value={departmentData.courses}
                  onChange={handleNumberInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Tech Block A, 2nd Floor"
                  value={departmentData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  placeholder="e.g., +91-123-4567890"
                  value={departmentData.contact}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Department Email</Label>
                <Input
                  id="email"
                  placeholder="e.g., cse@university.edu"
                  value={departmentData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="e.g., https://university.edu/cse"
                  value={departmentData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDepartmentDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDepartment} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
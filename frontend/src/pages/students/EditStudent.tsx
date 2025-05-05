import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { studentsAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  program?: string;
  enrollmentDate?: string | Date;
  status?: string;
  contactNumber?: string;
  address?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  gpa?: number;
}

export default function EditStudent() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const initialStudent = location.state?.student || null;
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    department: "",
    program: "",
    enrollmentDate: "",
    status: "",
    contactNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    gpa: ""
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        
        // If student data was passed through navigation
        if (initialStudent) {
          setStudent(initialStudent);
          setFormData({
            name: initialStudent.name || "",
            studentId: initialStudent.studentId || "",
            email: initialStudent.email || "",
            department: initialStudent.department || "",
            program: initialStudent.program || "",
            enrollmentDate: initialStudent.enrollmentDate 
              ? new Date(initialStudent.enrollmentDate).toISOString().split('T')[0] 
              : "",
            status: initialStudent.status || "",
            contactNumber: initialStudent.contactNumber || "",
            address: initialStudent.address || "",
            dateOfBirth: initialStudent.dateOfBirth 
              ? new Date(initialStudent.dateOfBirth).toISOString().split('T')[0]
              : "",
            gender: initialStudent.gender || "",
            gpa: initialStudent.gpa?.toString() || ""
          });
          setIsLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        if (id) {
          const response = await studentsAPI.getById(id);
          if (response.data) {
            setStudent(response.data);
            setFormData({
              name: response.data.name || "",
              studentId: response.data.studentId || "",
              email: response.data.email || "",
              department: response.data.department || "",
              program: response.data.program || "",
              enrollmentDate: response.data.enrollmentDate 
                ? new Date(response.data.enrollmentDate).toISOString().split('T')[0] 
                : "",
              status: response.data.status || "",
              contactNumber: response.data.contactNumber || "",
              address: response.data.address || "",
              dateOfBirth: response.data.dateOfBirth 
                ? new Date(response.data.dateOfBirth).toISOString().split('T')[0]
                : "",
              gender: response.data.gender || "",
              gpa: response.data.gpa?.toString() || ""
            });
          }
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load student data. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudent();
  }, [id, initialStudent, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!student?._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Student ID is missing. Cannot update record."
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Format the data for the API
      const updatedData = {
        ...formData,
        gpa: formData.gpa ? parseFloat(formData.gpa) : undefined
      };
      
      await studentsAPI.update(student._id, updatedData);
      
      toast({
        title: "Success",
        description: "Student information updated successfully."
      });
      
      // Navigate back to students list
      navigate("/students");
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update student information. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/students")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">Student not found or could not be loaded.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/students")}
                className="mt-4"
              >
                Return to Student List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
          <p className="text-muted-foreground">
            Update information for {student.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/students")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="academic">Academic Details</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Basic details about the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID *</Label>
                    <Input
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Student's academic details and enrollment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                      required
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science and Engineering">Computer Science and Engineering</SelectItem>
                        <SelectItem value="Electronics and Communication Engineering">Electronics and Communication Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
                        <SelectItem value="Management Studies">Management Studies</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Architecture">Architecture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select
                      value={formData.program}
                      onValueChange={(value) => handleSelectChange("program", value)}
                    >
                      <SelectTrigger id="program">
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B.Tech">B.Tech</SelectItem>
                        <SelectItem value="M.Tech">M.Tech</SelectItem>
                        <SelectItem value="BBA">BBA</SelectItem>
                        <SelectItem value="MBA">MBA</SelectItem>
                        <SelectItem value="B.Arch">B.Arch</SelectItem>
                        <SelectItem value="B.Sc">B.Sc</SelectItem>
                        <SelectItem value="M.Sc">M.Sc</SelectItem>
                        <SelectItem value="Ph.D">Ph.D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                    <Input
                      id="enrollmentDate"
                      name="enrollmentDate"
                      type="date"
                      value={formData.enrollmentDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      name="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.gpa}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Student's contact details and address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 
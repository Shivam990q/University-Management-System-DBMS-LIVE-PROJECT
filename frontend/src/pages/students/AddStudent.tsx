import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent, useRef } from "react";
import { studentsAPI } from "@/lib/api";

export default function AddStudent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic info
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    nationality: "",
    
    // Academic details
    department: "",
    program: "",
    admissionYear: "",
    semester: "",
    enrollmentNo: "",
    registrationNo: "",
    
    // Contact info
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    
    // We'll handle documents separately if needed
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  // Handle tab change and save current tab data
  const handleTabChange = (value: string) => {
    // First save current tab data
    saveCurrentTabData();
    // Then change tab
    setActiveTab(value);
  };
  
  // Save data from current tab before moving to next
  const saveCurrentTabData = async () => {
    try {
      setIsSubmitting(true);
      
      // Format the data for the API
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        studentId: formData.enrollmentNo || formData.registrationNo || `TEMP-${Date.now()}`, // Generate temporary ID if not provided
        email: formData.email || `temp-${Date.now()}@placeholder.com`, // Generate temporary email if not provided
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        gender: formData.gender,
        department: formData.department || "not-specified",
        contactNumber: formData.phone,
        address: formData.address ? 
          `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`.trim() : 
          undefined,
        enrollmentDate: formData.admissionYear ? new Date(`${formData.admissionYear}-01-01`) : new Date(),
      };
      
      // Send data to API regardless of completeness
      // We'll save whatever data we have at this point
      await studentsAPI.create(studentData);
      
      toast({
        title: "Progress Saved",
        description: "Your changes have been saved to MongoDB.",
      });
      
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error Saving Data",
        description: "There was a problem saving your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Submit the full form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Format the data for the API
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`.trim() || "Unnamed Student",
        studentId: formData.enrollmentNo || formData.registrationNo || `ID-${Date.now()}`,
        email: formData.email || `student-${Date.now()}@example.com`,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        gender: formData.gender,
        department: formData.department || "not-specified",
        contactNumber: formData.phone,
        address: formData.address ? 
          `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`.trim() : 
          undefined,
        enrollmentDate: formData.admissionYear ? new Date(`${formData.admissionYear}-01-01`) : new Date(),
        emergencyContact: formData.emergencyContact,
      };
      
      // No validation needed - we'll save whatever data we have
      
      // Send data to API
      await studentsAPI.create(studentData);
      
      toast({
        title: "Student Added Successfully",
        description: "New student has been added to the system.",
      });
      
      // Navigate to student list after successful submission
      navigate("/students");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error Adding Student",
        description: "There was a problem adding the student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/students">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Add New Student</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Create a new student profile in the system
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <UserPlus className="h-4 w-4 mr-2" />
          {isSubmitting ? "Adding..." : "Add Student"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="academic">Academic Details</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      required 
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      required 
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date" 
                      required 
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select 
                      value={formData.bloodGroup} 
                      onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input 
                    id="nationality" 
                    placeholder="Indian"
                    value={formData.nationality}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button" 
                  className="ml-auto" 
                  onClick={() => handleTabChange("academic")}
                  disabled={isSubmitting}
                >
                  Save & Continue
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Academic Details</CardTitle>
                <CardDescription>
                  Enter the academic information of the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                        <SelectItem value="eee">Electrical & Electronics Engineering</SelectItem>
                        <SelectItem value="me">Mechanical Engineering</SelectItem>
                        <SelectItem value="ce">Civil Engineering</SelectItem>
                        <SelectItem value="ba">Business Administration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select 
                      value={formData.program} 
                      onValueChange={(value) => handleSelectChange("program", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btech">B.Tech</SelectItem>
                        <SelectItem value="mtech">M.Tech</SelectItem>
                        <SelectItem value="bba">BBA</SelectItem>
                        <SelectItem value="mba">MBA</SelectItem>
                        <SelectItem value="phd">Ph.D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="admissionYear">Admission Year</Label>
                    <Select 
                      value={formData.admissionYear} 
                      onValueChange={(value) => handleSelectChange("admissionYear", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester">Current Semester</Label>
                    <Select 
                      value={formData.semester} 
                      onValueChange={(value) => handleSelectChange("semester", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Semester</SelectItem>
                        <SelectItem value="2">2nd Semester</SelectItem>
                        <SelectItem value="3">3rd Semester</SelectItem>
                        <SelectItem value="4">4th Semester</SelectItem>
                        <SelectItem value="5">5th Semester</SelectItem>
                        <SelectItem value="6">6th Semester</SelectItem>
                        <SelectItem value="7">7th Semester</SelectItem>
                        <SelectItem value="8">8th Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentNo">Enrollment Number</Label>
                    <Input 
                      id="enrollmentNo" 
                      placeholder="2025CSE001"
                      value={formData.enrollmentNo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNo">Registration Number</Label>
                    <Input 
                      id="registrationNo" 
                      placeholder="ITMU2025001"
                      value={formData.registrationNo}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button" 
                  className="ml-auto"
                  onClick={() => handleTabChange("contact")}
                  disabled={isSubmitting}
                >
                  Save & Continue
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Enter the contact details of the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    placeholder="123 Main St, City"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input 
                      id="pincode" 
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input 
                    id="emergencyContact" 
                    placeholder="+91 9876543210"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button" 
                  className="ml-auto"
                  onClick={() => handleTabChange("documents")}
                  disabled={isSubmitting}
                >
                  Save & Continue
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Upload necessary documents for the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="photo">Photo</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground">JPEG, PNG or JPG (Max. 1MB)</p>
                      <Button type="button" variant="outline" size="sm" className="mt-4">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idProof">ID Proof</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground">PDF or Image (Max. 2MB)</p>
                      <Button type="button" variant="outline" size="sm" className="mt-4">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="marksheet">Previous Marksheet</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground">PDF (Max. 5MB)</p>
                      <Button type="button" variant="outline" size="sm" className="mt-4">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificate">Other Certificates</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground">PDF (Max. 10MB)</p>
                      <Button type="button" variant="outline" size="sm" className="mt-4">
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="ml-auto"
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Complete Registration"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}

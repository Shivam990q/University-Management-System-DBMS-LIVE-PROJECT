import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { departmentsAPI } from "@/lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function AddDepartment() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    established: "",
    hod: "",
    hodEmail: "",
    students: "",
    faculty: "",
    courses: "",
    programs: "",
    description: "",
    location: "",
    contact: "",
    email: "",
    website: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.code) {
      toast({
        title: "Error",
        description: "Department name and code are required.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format data for API
      const departmentData = {
        ...formData,
        // Convert string numbers to actual numbers
        students: formData.students ? parseInt(formData.students) : 0,
        faculty: formData.faculty ? parseInt(formData.faculty) : 0,
        courses: formData.courses ? parseInt(formData.courses) : 0,
        // Convert comma-separated programs to array
        programs: formData.programs.split(',').map(p => p.trim()).filter(Boolean)
      };
      
      await departmentsAPI.create(departmentData);
      
      toast({
        title: "Success",
        description: "Department created successfully!"
      });
      
      // Navigate back to departments list
      navigate('/departments');
    } catch (error) {
      console.error("Error creating department:", error);
      toast({
        title: "Error",
        description: "Failed to create department. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/departments')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Department</h1>
            <p className="text-muted-foreground">
              Create a new academic department
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Information</CardTitle>
            <CardDescription>
              Enter the basic information about the department
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g., Computer Science & Engineering"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Department Code <span className="text-red-500">*</span></Label>
                <Input
                  id="code"
                  placeholder="e.g., CSE"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="established">Established Year</Label>
                <Input
                  id="established"
                  placeholder="e.g., 2005"
                  value={formData.established}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="programs">Programs Offered</Label>
                <Input
                  id="programs"
                  placeholder="e.g., B.Tech, M.Tech, Ph.D (comma-separated)"
                  value={formData.programs}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Department Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the department"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Leadership & Statistics</CardTitle>
            <CardDescription>
              Department leadership and numerical data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hod">Head of Department</Label>
                <Input
                  id="hod"
                  placeholder="e.g., Dr. John Doe"
                  value={formData.hod}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hodEmail">HOD Email</Label>
                <Input
                  id="hodEmail"
                  placeholder="e.g., john.doe@university.edu"
                  value={formData.hodEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="students">Number of Students</Label>
                <Input
                  id="students"
                  type="number"
                  placeholder="e.g., 1250"
                  value={formData.students}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="faculty">Number of Faculty</Label>
                <Input
                  id="faculty"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courses">Number of Courses</Label>
                <Input
                  id="courses"
                  type="number"
                  placeholder="e.g., 32"
                  value={formData.courses}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Department location and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Tech Block A, 2nd Floor"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  placeholder="e.g., +91-123-4567890"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Department Email</Label>
                <Input
                  id="email"
                  placeholder="e.g., cse@university.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="e.g., https://university.edu/cse"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/departments')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Department'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 
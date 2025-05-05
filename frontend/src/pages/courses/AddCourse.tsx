import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { coursesAPI } from "@/lib/api";

export default function AddCourse() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic info
    courseTitle: "",
    courseCode: "",
    department: "",
    credits: "",
    courseType: "",
    courseDescription: "",
    
    // Course details
    instructor: "",
    coInstructor: "",
    semester: "",
    academicYear: "",
    maxEnrollment: "",
    prerequisites: "",
    syllabus: "",
    
    // Scheduling
    lectureDay1: "",
    lectureTime1: "",
    lectureVenue1: "",
    lectureDay2: "",
    lectureTime2: "",
    lectureVenue2: "",
    practicalDay: "",
    practicalTime: "",
    practicalVenue: "",
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
      const courseData = {
        name: formData.courseTitle || `Course-${Date.now()}`,
        courseCode: formData.courseCode || `CODE-${Date.now()}`,
        description: formData.courseDescription,
        department: formData.department || "not-specified",
        credits: parseInt(formData.credits) || 3,
        instructor: formData.instructor,
        schedule: {
          days: [formData.lectureDay1, formData.lectureDay2].filter(Boolean),
          startTime: formData.lectureTime1,
          endTime: formData.lectureTime2,
          location: formData.lectureVenue1
        },
        maxCapacity: parseInt(formData.maxEnrollment) || 30,
      };
      
      // Send data to API
      await coursesAPI.create(courseData);
      
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
      const courseData = {
        name: formData.courseTitle || `Course-${Date.now()}`,
        courseCode: formData.courseCode || `CODE-${Date.now()}`,
        description: formData.courseDescription,
        department: formData.department || "not-specified",
        credits: parseInt(formData.credits) || 3,
        instructor: formData.instructor,
        schedule: {
          days: [formData.lectureDay1, formData.lectureDay2].filter(Boolean),
          startTime: formData.lectureTime1,
          endTime: formData.lectureTime2,
          location: formData.lectureVenue1
        },
        maxCapacity: parseInt(formData.maxEnrollment) || 30,
        // Additional fields
        syllabus: formData.syllabus,
        prerequisites: formData.prerequisites,
        academicYear: formData.academicYear,
        semester: formData.semester,
        courseType: formData.courseType,
        practicalDetails: formData.practicalDay ? {
          day: formData.practicalDay,
          time: formData.practicalTime,
          venue: formData.practicalVenue
        } : undefined
      };
      
      // Send data to API
      await coursesAPI.create(courseData);
      
      toast({
        title: "Course Added Successfully",
        description: "New course has been added to the system.",
      });
      
      // Navigate to course list after successful submission
      navigate("/courses");
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error Adding Course",
        description: "There was a problem adding the course. Please try again.",
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
            <Link to="/courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Add New Course</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Create a new course in the system
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <BookOpen className="h-4 w-4 mr-2" />
          {isSubmitting ? "Adding..." : "Add Course"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details of the course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input 
                      id="courseTitle" 
                      placeholder="Introduction to Computer Science" 
                      required 
                      value={formData.courseTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code</Label>
                    <Input 
                      id="courseCode" 
                      placeholder="CSE101" 
                      required 
                      value={formData.courseCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <Label htmlFor="credits">Credits</Label>
                    <Select
                      value={formData.credits}
                      onValueChange={(value) => handleSelectChange("credits", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select credits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Credit</SelectItem>
                        <SelectItem value="2">2 Credits</SelectItem>
                        <SelectItem value="3">3 Credits</SelectItem>
                        <SelectItem value="4">4 Credits</SelectItem>
                        <SelectItem value="5">5 Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseType">Course Type</Label>
                    <Select
                      value={formData.courseType}
                      onValueChange={(value) => handleSelectChange("courseType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="core">Core</SelectItem>
                        <SelectItem value="elective">Elective</SelectItem>
                        <SelectItem value="lab">Laboratory</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseDescription">Course Description</Label>
                  <Textarea
                    id="courseDescription"
                    placeholder="Provide a brief description of the course content, objectives, and learning outcomes."
                    rows={5}
                    value={formData.courseDescription}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button" 
                  className="ml-auto" 
                  onClick={() => handleTabChange("details")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save & Continue"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Enter the detailed information about the course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Primary Instructor</Label>
                    <Select
                      value={formData.instructor}
                      onValueChange={(value) => handleSelectChange("instructor", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prof1">Dr. Rajesh Sharma</SelectItem>
                        <SelectItem value="prof2">Dr. Meera Patel</SelectItem>
                        <SelectItem value="prof3">Dr. Arun Singh</SelectItem>
                        <SelectItem value="prof4">Dr. Priya Verma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coInstructor">Co-Instructor (Optional)</Label>
                    <Select
                      value={formData.coInstructor}
                      onValueChange={(value) => handleSelectChange("coInstructor", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select co-instructor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="prof1">Dr. Rajesh Sharma</SelectItem>
                        <SelectItem value="prof2">Dr. Meera Patel</SelectItem>
                        <SelectItem value="prof3">Dr. Arun Singh</SelectItem>
                        <SelectItem value="prof4">Dr. Priya Verma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => handleSelectChange("semester", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall">Fall 2025</SelectItem>
                        <SelectItem value="spring">Spring 2026</SelectItem>
                        <SelectItem value="summer">Summer 2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select
                      value={formData.academicYear}
                      onValueChange={(value) => handleSelectChange("academicYear", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                        <SelectItem value="2026-27">2026-27</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxEnrollment">Maximum Enrollment</Label>
                    <Input 
                      id="maxEnrollment" 
                      type="number" 
                      placeholder="60" 
                      min="1" 
                      value={formData.maxEnrollment}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Textarea
                    id="prerequisites"
                    placeholder="List any prerequisite courses or knowledge required for this course"
                    rows={3}
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syllabus">Syllabus Outline</Label>
                  <Textarea
                    id="syllabus"
                    placeholder="Provide a brief outline of the syllabus including major topics"
                    rows={5}
                    value={formData.syllabus}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="button" 
                  className="ml-auto"
                  onClick={() => handleTabChange("scheduling")}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save & Continue"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling">
            <Card>
              <CardHeader>
                <CardTitle>Course Scheduling</CardTitle>
                <CardDescription>
                  Set up the schedule for lectures and practical sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-3">Theory Classes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lectureDay1">Day 1</Label>
                      <Select
                        value={formData.lectureDay1}
                        onValueChange={(value) => handleSelectChange("lectureDay1", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lectureTime1">Time 1</Label>
                      <Input 
                        id="lectureTime1" 
                        placeholder="10:00 AM - 11:30 AM"
                        value={formData.lectureTime1}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lectureVenue1">Venue 1</Label>
                      <Input 
                        id="lectureVenue1" 
                        placeholder="Room 101, Main Building"
                        value={formData.lectureVenue1}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="lectureDay2">Day 2 (Optional)</Label>
                      <Select
                        value={formData.lectureDay2}
                        onValueChange={(value) => handleSelectChange("lectureDay2", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lectureTime2">Time 2</Label>
                      <Input 
                        id="lectureTime2" 
                        placeholder="10:00 AM - 11:30 AM"
                        value={formData.lectureTime2}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lectureVenue2">Venue 2</Label>
                      <Input 
                        id="lectureVenue2" 
                        placeholder="Room 101, Main Building"
                        value={formData.lectureVenue2}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="border p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-3">Practical/Lab Sessions (if applicable)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="practicalDay">Day</Label>
                      <Select
                        value={formData.practicalDay}
                        onValueChange={(value) => handleSelectChange("practicalDay", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practicalTime">Time</Label>
                      <Input 
                        id="practicalTime" 
                        placeholder="2:00 PM - 4:00 PM"
                        value={formData.practicalTime}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practicalVenue">Venue</Label>
                      <Input 
                        id="practicalVenue" 
                        placeholder="Lab 203, CS Building"
                        value={formData.practicalVenue}
                        onChange={handleInputChange}
                      />
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
                  {isSubmitting ? "Submitting..." : "Complete Course Setup"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}

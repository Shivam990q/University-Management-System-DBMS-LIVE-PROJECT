import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Book, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { coursesAPI } from "@/lib/api";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseData, setCourseData] = useState({
    courseCode: "",
    name: "",
    department: "",
    creditHours: 3,
    description: "",
    syllabus: "",
    semester: "fall",
    academicYear: new Date().getFullYear().toString(),
    instructor: "",
    prerequisites: "",
    capacity: 30,
    location: "",
    schedule: {
      days: [],
      startTime: "",
      endTime: "",
    },
    isActive: true,
    isElective: false,
    isCoreSubject: true,
    registrationOpen: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCourseData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setCourseData(prev => ({ ...prev, [id]: value }));
  };

  const handleScheduleDayChange = (day: string, isSelected: boolean) => {
    setCourseData(prev => {
      const updatedDays = isSelected
        ? [...prev.schedule.days, day]
        : prev.schedule.days.filter(d => d !== day);
      
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          days: updatedDays
        }
      };
    });
  };

  const handleScheduleTimeChange = (field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setCourseData(prev => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Format course data for submission
      const formattedCourseData = {
        ...courseData,
        createdAt: new Date().toISOString(),
      };
      
      // Submit to API
      await coursesAPI.create(formattedCourseData);
      
      toast({
        title: "Course Created",
        description: "The course has been successfully created.",
      });
      
      // Navigate back to courses list
      navigate("/courses");
      
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error Creating Course",
        description: "There was a problem creating the course. Please try again.",
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
            <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Add a new course to the university curriculum
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Course"}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="settings">Course Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>
                  Enter the basic details for this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code</Label>
                    <Input 
                      id="courseCode" 
                      placeholder="CS101" 
                      required
                      value={courseData.courseCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Introduction to Computer Science" 
                      required
                      value={courseData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={courseData.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts & Humanities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creditHours">Credit Hours</Label>
                    <Input 
                      id="creditHours" 
                      type="number" 
                      min="1" 
                      max="6"
                      required
                      value={courseData.creditHours}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the course content and objectives..."
                    rows={4}
                    required
                    value={courseData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syllabus">Course Syllabus</Label>
                  <Textarea
                    id="syllabus"
                    placeholder="Week 1: Introduction to key concepts\nWeek 2: Fundamental principles..."
                    rows={6}
                    value={courseData.syllabus}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Primary Instructor</Label>
                    <Input 
                      id="instructor" 
                      placeholder="Dr. Jane Smith" 
                      value={courseData.instructor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prerequisites">Prerequisites</Label>
                    <Input 
                      id="prerequisites" 
                      placeholder="CS100, MATH101" 
                      value={courseData.prerequisites}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Schedule</CardTitle>
                <CardDescription>
                  Set up the timing and location for this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Meeting Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={courseData.schedule.days.includes(day) ? "default" : "outline"}
                        onClick={() => handleScheduleDayChange(day, !courseData.schedule.days.includes(day))}
                        className="h-8"
                      >
                        {day.substring(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      type="time" 
                      value={courseData.schedule.startTime}
                      onChange={(e) => handleScheduleTimeChange("startTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                      type="time" 
                      value={courseData.schedule.endTime}
                      onChange={(e) => handleScheduleTimeChange("endTime", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="Room 203, Science Building" 
                      value={courseData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Class Capacity</Label>
                    <Input 
                      id="capacity" 
                      type="number" 
                      min="1" 
                      value={courseData.capacity}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                      value={courseData.semester}
                      onValueChange={(value) => handleSelectChange("semester", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall">Fall</SelectItem>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input 
                      id="academicYear" 
                      placeholder={new Date().getFullYear().toString()} 
                      value={courseData.academicYear}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>
                  Configure additional settings for this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isActive">Active Course</Label>
                      <p className="text-sm text-muted-foreground">
                        Whether this course is currently active and visible
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={courseData.isActive}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("isActive", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isElective">Elective Course</Label>
                      <p className="text-sm text-muted-foreground">
                        This course is an elective rather than required
                      </p>
                    </div>
                    <Switch
                      id="isElective"
                      checked={courseData.isElective}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("isElective", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="isCoreSubject">Core Subject</Label>
                      <p className="text-sm text-muted-foreground">
                        This course is part of the core curriculum
                      </p>
                    </div>
                    <Switch
                      id="isCoreSubject"
                      checked={courseData.isCoreSubject}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("isCoreSubject", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="registrationOpen">Registration Open</Label>
                      <p className="text-sm text-muted-foreground">
                        Students can currently register for this course
                      </p>
                    </div>
                    <Switch
                      id="registrationOpen"
                      checked={courseData.registrationOpen}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("registrationOpen", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Book className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Create Course"}
          </Button>
        </div>
      </form>
    </div>
  );
} 
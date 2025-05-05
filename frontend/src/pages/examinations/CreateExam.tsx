import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { examinationsAPI, coursesAPI } from "@/lib/api";

export default function CreateExam() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  
  const [examData, setExamData] = useState({
    title: "",
    type: "midterm", // midterm, final, quiz, practical
    academicTerm: "Spring 2023",
    department: "",
    courses: [],
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date().toISOString().slice(0, 16),
    duration: "180", // in minutes
    venue: "",
    maxMarks: "100",
    passingMarks: "40",
    instructions: "",
    proctored: true,
    allowCalculator: false,
    allowBooks: false,
    allowNotes: false,
    onlineExam: false,
    status: "scheduled" // scheduled, in-progress, completed, cancelled
  });

  useEffect(() => {
    // Fetch departments and courses when component mounts
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesData = await coursesAPI.getAll();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast({
          title: "Error Loading Data",
          description: "There was a problem fetching the required data.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setExamData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setExamData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setExamData(prev => ({ ...prev, [id]: checked }));
  };

  const handleCourseCheckboxChange = (courseId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourses(prev => [...prev, courseId]);
    } else {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Format exam data for submission
      const formattedExamData = {
        ...examData,
        courses: selectedCourses,
        startDate: new Date(examData.startDate).toISOString(),
        endDate: new Date(examData.endDate).toISOString(),
        duration: parseInt(examData.duration),
        maxMarks: parseInt(examData.maxMarks),
        passingMarks: parseInt(examData.passingMarks),
        createdAt: new Date().toISOString()
      };
      
      // Submit to backend MongoDB API
      const response = await fetch('http://localhost:5000/api/examinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedExamData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create examination');
      }
      
      const result = await response.json();
      
      toast({
        title: "Examination Created",
        description: "The examination has been successfully saved to MongoDB.",
      });
      
      // Navigate back to examinations list
      navigate("/examinations");
    } catch (error) {
      console.error("Error creating examination:", error);
      toast({
        title: "Error Creating Examination",
        description: "There was a problem connecting to the database. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link to="/examinations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create New Examination</h1>
        </div>
        <Button disabled={isSubmitting} onClick={(e) => handleSubmit(e)}>
          {isSubmitting ? 'Saving...' : 'Save Examination'}
        </Button>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Examination Details</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details of the examination.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Examination Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Midterm Examination"
                    value={examData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Examination Type</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("type", value)}
                    defaultValue={examData.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midterm">Midterm</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="practical">Practical</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicTerm">Academic Term</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("academicTerm", value)}
                    defaultValue={examData.academicTerm}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spring 2023">Spring 2023</SelectItem>
                      <SelectItem value="Summer 2023">Summer 2023</SelectItem>
                      <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                      <SelectItem value="Winter 2023">Winter 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("department", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Courses</Label>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {courses.length > 0 ? (
                    courses.map((course: any) => (
                      <div key={course._id || course.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`course-${course._id || course.id}`}
                          checked={selectedCourses.includes(course._id || course.id)}
                          onCheckedChange={(checked) => 
                            handleCourseCheckboxChange(course._id || course.id, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={`course-${course._id || course.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {course.courseCode} - {course.courseTitle || course.name}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No courses available. Please add courses first.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling">
          <Card>
            <CardHeader>
              <CardTitle>Scheduling Information</CardTitle>
              <CardDescription>
                Set when and where the examination will take place.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input 
                    id="startDate" 
                    type="datetime-local"
                    value={examData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input 
                    id="endDate" 
                    type="datetime-local"
                    value={examData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="180"
                    value={examData.duration}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input 
                    id="venue" 
                    placeholder="e.g., Room 101"
                    value={examData.venue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxMarks">Maximum Marks</Label>
                  <Input 
                    id="maxMarks" 
                    type="number" 
                    placeholder="100"
                    value={examData.maxMarks}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passingMarks">Passing Marks</Label>
                  <Input 
                    id="passingMarks" 
                    type="number" 
                    placeholder="40"
                    value={examData.passingMarks}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Examination Configuration</CardTitle>
              <CardDescription>
                Configure examination rules and instructions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea 
                  id="instructions" 
                  placeholder="Enter any special instructions for students..."
                  value={examData.instructions}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="proctored" 
                      checked={examData.proctored}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("proctored", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="proctored"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Proctored examination
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allowCalculator" 
                      checked={examData.allowCalculator}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("allowCalculator", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="allowCalculator"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow calculator
                    </label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allowBooks" 
                      checked={examData.allowBooks}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("allowBooks", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="allowBooks"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow books
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="allowNotes" 
                      checked={examData.allowNotes}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("allowNotes", checked as boolean)
                      }
                    />
                    <label
                      htmlFor="allowNotes"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow notes
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="onlineExam" 
                  checked={examData.onlineExam}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("onlineExam", checked as boolean)
                  }
                />
                <label
                  htmlFor="onlineExam"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Online examination
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

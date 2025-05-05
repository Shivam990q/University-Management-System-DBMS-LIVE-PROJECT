import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { coursesAPI } from "@/lib/api";  // Using coursesAPI temporarily for exams

export default function CreateExam() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examData, setExamData] = useState({
    title: "",
    course: "",
    examType: "midterm",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    totalMarks: "",
    passingMarks: "",
    description: "",
    instructions: "",
    isOnline: false,
    requiresProctoring: false,
    allowCalculator: false,
    allowNotes: false,
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Prepare exam data for submission
      const formattedExamData = {
        ...examData,
        totalMarks: parseInt(examData.totalMarks) || 0,
        passingMarks: parseInt(examData.passingMarks) || 0,
        createdAt: new Date().toISOString(),
      };
      
      // Submit to API (using coursesAPI as a temporary solution)
      // In production, this would be examsAPI.create()
      await coursesAPI.create({
        type: "exam",
        ...formattedExamData
      });
      
      toast({
        title: "Exam Created",
        description: "The exam has been successfully created.",
      });
      
      // Navigate back to exams list
      navigate("/exams");
      
    } catch (error) {
      console.error("Error creating exam:", error);
      toast({
        title: "Error Creating Exam",
        description: "There was a problem creating the exam. Please try again.",
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
            <Link to="/exams">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Exam</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Schedule a new examination
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Exam"}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
            <CardDescription>
              Enter the details for this examination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Exam Title</Label>
              <Input 
                id="title" 
                placeholder="Midterm Examination - Fall 2025" 
                required
                value={examData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select 
                  value={examData.course}
                  onValueChange={(value) => handleSelectChange("course", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs101">CS101: Introduction to Computer Science</SelectItem>
                    <SelectItem value="cs201">CS201: Data Structures and Algorithms</SelectItem>
                    <SelectItem value="math101">MATH101: Calculus I</SelectItem>
                    <SelectItem value="eng101">ENG101: Technical Writing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <Select
                  value={examData.examType}
                  onValueChange={(value) => handleSelectChange("examType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="midterm">Midterm Examination</SelectItem>
                    <SelectItem value="final">Final Examination</SelectItem>
                    <SelectItem value="practical">Practical Examination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Exam Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  required
                  value={examData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="time" 
                  required
                  value={examData.startTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input 
                  id="endTime" 
                  type="time" 
                  required
                  value={examData.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="Room 101, Block A" 
                value={examData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input 
                  id="totalMarks" 
                  type="number" 
                  placeholder="100" 
                  required
                  value={examData.totalMarks}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingMarks">Passing Marks</Label>
                <Input 
                  id="passingMarks" 
                  type="number" 
                  placeholder="50" 
                  required
                  value={examData.passingMarks}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Exam Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description about the exam"
                rows={3}
                value={examData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions for Students</Label>
              <Textarea
                id="instructions"
                placeholder="Instructions for students taking the exam"
                rows={5}
                value={examData.instructions}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isOnline" 
                    checked={examData.isOnline}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("isOnline", checked as boolean)
                    } 
                  />
                  <Label htmlFor="isOnline" className="cursor-pointer">Online Exam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="requiresProctoring" 
                    checked={examData.requiresProctoring}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("requiresProctoring", checked as boolean)
                    } 
                  />
                  <Label htmlFor="requiresProctoring" className="cursor-pointer">Requires Proctoring</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allowCalculator" 
                    checked={examData.allowCalculator}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("allowCalculator", checked as boolean)
                    } 
                  />
                  <Label htmlFor="allowCalculator" className="cursor-pointer">Calculator Allowed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allowNotes" 
                    checked={examData.allowNotes}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("allowNotes", checked as boolean)
                    } 
                  />
                  <Label htmlFor="allowNotes" className="cursor-pointer">Notes Allowed</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              <Calendar className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Create Exam"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 
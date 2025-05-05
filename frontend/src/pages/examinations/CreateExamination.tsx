import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { examinationsAPI } from "@/lib/api";

export default function CreateExamination() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examinationData, setExaminationData] = useState({
    title: "",
    course: "",
    type: "midterm", // midterm, final, quiz, practical
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: 120, // in minutes
    totalMarks: 100,
    passingMarks: 40,
    location: "",
    instructions: "",
    allowedMaterials: "",
    sections: [
      {
        name: "Multiple Choice",
        totalQuestions: 20,
        marksPerQuestion: 2,
      }
    ],
    proctored: true,
    makeupExamAvailable: false,
    published: false,
    notifyStudents: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setExaminationData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setExaminationData(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setExaminationData(prev => ({ ...prev, [id]: checked }));
  };

  const handleSectionChange = (index: number, field: string, value: string | number) => {
    setExaminationData(prev => {
      const updatedSections = [...prev.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: typeof value === 'number' ? value : parseInt(value) || 0
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  const addSection = () => {
    setExaminationData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          name: `Section ${prev.sections.length + 1}`,
          totalQuestions: 5,
          marksPerQuestion: 2,
        }
      ]
    }));
  };

  const removeSection = (index: number) => {
    setExaminationData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Format examination data for submission
      const formattedExaminationData = {
        ...examinationData,
        totalMarks: Number(examinationData.totalMarks),
        passingMarks: Number(examinationData.passingMarks),
        duration: Number(examinationData.duration),
        createdAt: new Date().toISOString(),
      };
      
      // Submit to API
      await examinationsAPI.create(formattedExaminationData);
      
      toast({
        title: "Examination Created",
        description: "The examination has been successfully created.",
      });
      
      // Navigate back to examinations list
      navigate("/examinations");
      
    } catch (error) {
      console.error("Error creating examination:", error);
      toast({
        title: "Error Creating Examination",
        description: "There was a problem creating the examination. Please try again.",
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
            <Link to="/examinations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Examination</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Add a new examination to the system
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Examination"}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Examination Details</TabsTrigger>
            <TabsTrigger value="structure">Exam Structure</TabsTrigger>
            <TabsTrigger value="settings">Exam Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the details for this examination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Examination Title</Label>
                    <Input 
                      id="title" 
                      placeholder="Midterm Examination" 
                      required
                      value={examinationData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={examinationData.course}
                      onValueChange={(value) => handleSelectChange("course", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CS101">CS101: Introduction to Programming</SelectItem>
                        <SelectItem value="MATH201">MATH201: Calculus II</SelectItem>
                        <SelectItem value="PHYS101">PHYS101: Physics I</SelectItem>
                        <SelectItem value="ENG205">ENG205: Technical Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Examination Type</Label>
                    <Select
                      value={examinationData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="midterm">Midterm Exam</SelectItem>
                        <SelectItem value="final">Final Exam</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="practical">Practical Test</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Examination Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      required
                      value={examinationData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input 
                      id="startTime" 
                      type="time" 
                      required
                      value={examinationData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input 
                      id="endTime" 
                      type="time" 
                      required
                      value={examinationData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input 
                      id="duration" 
                      type="number" 
                      min="1"
                      required
                      value={examinationData.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a brief description of the examination..."
                    rows={3}
                    value={examinationData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="Room 101, Main Building" 
                      value={examinationData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allowedMaterials">Allowed Materials</Label>
                    <Input 
                      id="allowedMaterials" 
                      placeholder="Calculator, One-page cheat sheet" 
                      value={examinationData.allowedMaterials}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grading Information</CardTitle>
                <CardDescription>
                  Set up grading criteria for this examination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input 
                      id="totalMarks" 
                      type="number" 
                      min="1"
                      required
                      value={examinationData.totalMarks}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingMarks">Passing Marks</Label>
                    <Input 
                      id="passingMarks" 
                      type="number" 
                      min="0"
                      required
                      value={examinationData.passingMarks}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions for Students</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Instructions for students taking the examination..."
                    rows={4}
                    value={examinationData.instructions}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Examination Structure</CardTitle>
                <CardDescription>
                  Define the sections and question distribution for this exam
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {examinationData.sections.map((section, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Section {index + 1}</div>
                      {examinationData.sections.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeSection(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`section-${index}-name`}>Section Name</Label>
                        <Input 
                          id={`section-${index}-name`} 
                          value={section.name}
                          onChange={(e) => handleSectionChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`section-${index}-questions`}>Number of Questions</Label>
                        <Input 
                          id={`section-${index}-questions`} 
                          type="number"
                          min="1"
                          value={section.totalQuestions}
                          onChange={(e) => handleSectionChange(index, "totalQuestions", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`section-${index}-marks`}>Marks per Question</Label>
                        <Input 
                          id={`section-${index}-marks`} 
                          type="number"
                          min="1"
                          value={section.marksPerQuestion}
                          onChange={(e) => handleSectionChange(index, "marksPerQuestion", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Total: {section.totalQuestions * section.marksPerQuestion} marks
                    </div>
                  </div>
                ))}

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addSection}
                  className="mt-4"
                >
                  Add Another Section
                </Button>

                <div className="mt-6 p-4 bg-muted rounded-md">
                  <div className="font-medium mb-2">Examination Summary</div>
                  <div className="text-sm space-y-1">
                    <div>Total Sections: {examinationData.sections.length}</div>
                    <div>
                      Total Questions: {examinationData.sections.reduce((sum, section) => sum + section.totalQuestions, 0)}
                    </div>
                    <div>
                      Calculated Total Marks: {examinationData.sections.reduce((sum, section) => sum + (section.totalQuestions * section.marksPerQuestion), 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Examination Settings</CardTitle>
                <CardDescription>
                  Configure additional settings for this examination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="proctored">Proctored Examination</Label>
                      <p className="text-sm text-muted-foreground">
                        This examination requires proctoring or supervision
                      </p>
                    </div>
                    <Switch
                      id="proctored"
                      checked={examinationData.proctored}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("proctored", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="makeupExamAvailable">Makeup Exam Available</Label>
                      <p className="text-sm text-muted-foreground">
                        A makeup examination will be available for eligible students
                      </p>
                    </div>
                    <Switch
                      id="makeupExamAvailable"
                      checked={examinationData.makeupExamAvailable}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("makeupExamAvailable", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="published">Publish Examination</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this examination visible to students
                      </p>
                    </div>
                    <Switch
                      id="published"
                      checked={examinationData.published}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("published", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifyStudents">Notify Students</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notification to enrolled students about this examination
                      </p>
                    </div>
                    <Switch
                      id="notifyStudents"
                      checked={examinationData.notifyStudents}
                      onCheckedChange={(checked) => 
                        handleSwitchChange("notifyStudents", checked)
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
            <FileText className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Create Examination"}
          </Button>
        </div>
      </form>
    </div>
  );
} 
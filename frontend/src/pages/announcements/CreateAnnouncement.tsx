import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { announcementsAPI } from "@/lib/api";

export default function CreateAnnouncement() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcementData, setAnnouncementData] = useState({
    title: "",
    content: "",
    type: "general", // general, academic, event, emergency
    audience: "all", // all, students, faculty, staff, department
    department: "",
    publishDate: new Date(),
    expiryDate: null as Date | null,
    urgent: false,
    featured: false,
    sendEmail: true,
    sendPushNotification: false,
    attachment: null as File | null,
    attachmentPath: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAnnouncementData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setAnnouncementData(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setAnnouncementData(prev => ({ ...prev, [id]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnnouncementData(prev => ({ 
        ...prev, 
        attachment: e.target.files![0],
        attachmentPath: e.target.files![0].name
      }));
    }
  };

  const handlePublishDateChange = (date: Date | undefined) => {
    if (date) {
      setAnnouncementData(prev => ({ ...prev, publishDate: date }));
    }
  };

  const handleExpiryDateChange = (date: Date | undefined) => {
    setAnnouncementData(prev => ({ ...prev, expiryDate: date || null }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Format announcement data for submission
      const formattedAnnouncementData = {
        ...announcementData,
        publishDate: announcementData.publishDate.toISOString(),
        expiryDate: announcementData.expiryDate ? announcementData.expiryDate.toISOString() : null,
        createdAt: new Date().toISOString(),
        // Remove the actual File object, as we're not handling file upload in this version
        attachment: announcementData.attachmentPath ? announcementData.attachmentPath : null,
      };
      
      // Submit to backend MongoDB API
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedAnnouncementData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create announcement');
      }
      
      const result = await response.json();
      
      toast({
        title: "Announcement Created",
        description: "The announcement has been successfully saved to MongoDB.",
      });
      
      // Navigate back to announcements list
      navigate("/announcements");
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error Creating Announcement",
        description: "There was a problem connecting to the database. Please check your connection and try again.",
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
            <Link to="/announcements">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Announcement</h1>
          </div>
          <p className="text-muted-foreground ml-10">
            Create a new announcement to share information with the community
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Announcement"}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Announcement Information</CardTitle>
            <CardDescription>
              Provide the details for this announcement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Announcement Title</Label>
              <Input 
                id="title" 
                placeholder="Enter the announcement title" 
                required
                value={announcementData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Announcement Content</Label>
              <Textarea
                id="content"
                placeholder="Enter the announcement content..."
                rows={8}
                required
                value={announcementData.content}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Announcement Type</Label>
                <Select
                  value={announcementData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={announcementData.audience}
                  onValueChange={(value) => handleSelectChange("audience", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All University</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="faculty">Faculty Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                    <SelectItem value="department">Specific Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {announcementData.audience === "department" && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={announcementData.department}
                  onValueChange={(value) => handleSelectChange("department", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CS">Computer Science</SelectItem>
                    <SelectItem value="ENG">Engineering</SelectItem>
                    <SelectItem value="BUS">Business</SelectItem>
                    <SelectItem value="MED">Medical</SelectItem>
                    <SelectItem value="ART">Arts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(announcementData.publishDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={announcementData.publishDate}
                      onSelect={handlePublishDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {announcementData.expiryDate 
                        ? format(announcementData.expiryDate, "PPP")
                        : "No expiry date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={announcementData.expiryDate || undefined}
                      onSelect={handleExpiryDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment (Optional)</Label>
              <Input 
                id="attachment" 
                type="file" 
                onChange={handleFileChange}
              />
              {announcementData.attachmentPath && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {announcementData.attachmentPath}
                </p>
              )}
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="urgent">Mark as Urgent</Label>
                  <p className="text-sm text-muted-foreground">
                    Urgent announcements will be highlighted in the interface
                  </p>
                </div>
                <Switch
                  id="urgent"
                  checked={announcementData.urgent}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("urgent", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Feature this Announcement</Label>
                  <p className="text-sm text-muted-foreground">
                    Featured announcements will appear on the dashboard
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={announcementData.featured}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("featured", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendEmail">Send Email Notification</Label>
                  <p className="text-sm text-muted-foreground">
                    Send an email to the targeted audience
                  </p>
                </div>
                <Switch
                  id="sendEmail"
                  checked={announcementData.sendEmail}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("sendEmail", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendPushNotification">Send Push Notification</Label>
                  <p className="text-sm text-muted-foreground">
                    Send a push notification to mobile devices
                  </p>
                </div>
                <Switch
                  id="sendPushNotification"
                  checked={announcementData.sendPushNotification}
                  onCheckedChange={(checked) => 
                    handleSwitchChange("sendPushNotification", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Announcement..." : "Create Announcement"}
          </Button>
        </div>
      </form>
    </div>
  );
}

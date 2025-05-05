import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Filter, 
  Search,
  AlertCircle,
  Bell,
  X,
  FileDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { announcementsAPI } from "@/lib/api";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State for filter dialog
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  // State for confirm delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<any>(null);

  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [updatedAnnouncement, setUpdatedAnnouncement] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, [activeFilters]);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      
      // If there are filters, use the filter method
      let data;
      if (Object.keys(activeFilters).length > 0) {
        const response = await announcementsAPI.filter(activeFilters);
        data = response.data || [];
      } else {
        data = await announcementsAPI.getAll();
      }
      
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to load announcements. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    
    try {
      setIsLoading(true);
      await announcementsAPI.delete(announcementToDelete._id);
      
      // Remove from local state
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.filter(a => a._id !== announcementToDelete._id)
      );
      
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been successfully deleted.",
      });
      
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    } catch (err) {
      console.error("Error deleting announcement:", err);
      toast({
        title: "Error",
        description: "Failed to delete the announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAnnouncement = async () => {
    if (!editingAnnouncement) return;
    
    try {
      setIsSaving(true);
      
      // Format dates if they exist
      const formattedData = { ...updatedAnnouncement };
      if (formattedData.publishDate) {
        formattedData.publishDate = new Date(formattedData.publishDate).toISOString();
      }
      if (formattedData.expiryDate) {
        formattedData.expiryDate = new Date(formattedData.expiryDate).toISOString();
      }
      
      const updated = await announcementsAPI.update(editingAnnouncement._id, formattedData);
      
      // Update in local state
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(a => 
          a._id === editingAnnouncement._id ? { ...a, ...updated } : a
        )
      );
      
      toast({
        title: "Announcement Updated",
        description: "The announcement has been successfully updated.",
      });
      
      setEditDialogOpen(false);
      setEditingAnnouncement(null);
      setUpdatedAnnouncement({});
    } catch (err) {
      console.error("Error updating announcement:", err);
      toast({
        title: "Error",
        description: "Failed to update the announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const openEditDialog = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setUpdatedAnnouncement({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      audience: announcement.audience,
      department: announcement.department || "",
      urgent: announcement.urgent || false,
      featured: announcement.featured || false,
      publishDate: announcement.publishDate,
      expiryDate: announcement.expiryDate,
    });
    setEditDialogOpen(true);
  };

  const applyFilters = (filters: any) => {
    setActiveFilters(filters);
    setFilterDialogOpen(false);
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const exportToCSV = () => {
    // Get displayed announcements (filtered if applicable)
    const dataToExport = sortedAnnouncements;
    
    // Handle empty data
    if (dataToExport.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export.",
        variant: "destructive",
      });
      return;
    }
    
    // CSV Headers
    const headers = ["Title", "Type", "Audience", "Publish Date", "Expiry Date", "Content", "Urgent", "Featured"];
    
    // Format data for CSV
    const csvData = dataToExport.map(item => [
      item.title,
      item.type,
      item.audience,
      item.publishDate ? format(new Date(item.publishDate), "yyyy-MM-dd") : "",
      item.expiryDate ? format(new Date(item.expiryDate), "yyyy-MM-dd") : "",
      item.content?.replace(/,/g, ";").replace(/\n/g, " "), // Replace commas and newlines
      item.urgent ? "Yes" : "No",
      item.featured ? "Yes" : "No"
    ]);
    
    // Combine headers and rows
    const csv = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    // Create a blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `announcements_export_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter announcements based on search and applied filters
  const filteredAnnouncements = announcements.filter(announcement => 
    (announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     announcement.content?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort announcements: featured first, then by date (newest first)
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    // First sort by featured status
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then sort by date (newest first)
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  if (isLoading && !announcements.length) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error && !announcements.length) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <Badge>{announcements.length}</Badge>
        </div>
        <Link to="/announcements/new">
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Create Announcement
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search announcements..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {/* Filter Dialog */}
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter Announcements</DialogTitle>
                <DialogDescription>
                  Set criteria to filter announcements
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Announcement Type</Label>
                  <Select 
                    defaultValue={activeFilters.type || ""} 
                    onValueChange={(value) => setActiveFilters({...activeFilters, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select 
                    defaultValue={activeFilters.audience || ""} 
                    onValueChange={(value) => setActiveFilters({...activeFilters, audience: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Audiences</SelectItem>
                      <SelectItem value="all">University-wide</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Only</Label>
                    <Switch 
                      id="featured"
                      checked={activeFilters.featured === 'true'}
                      onCheckedChange={(checked) => 
                        setActiveFilters({...activeFilters, featured: checked ? 'true' : ''})
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="urgent">Urgent Only</Label>
                    <Switch 
                      id="urgent"
                      checked={activeFilters.urgent === 'true'}
                      onCheckedChange={(checked) => 
                        setActiveFilters({...activeFilters, urgent: checked ? 'true' : ''})
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button type="submit" onClick={() => applyFilters(activeFilters)}>
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Export Button with Dropdown Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Export to CSV
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {Object.keys(activeFilters).length > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {activeFilters.type && (
              <Badge variant="outline" className="flex items-center gap-1">
                Type: {activeFilters.type}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const { type, ...rest } = activeFilters;
                    setActiveFilters(rest);
                  }}
                />
              </Badge>
            )}
            {activeFilters.audience && (
              <Badge variant="outline" className="flex items-center gap-1">
                Audience: {activeFilters.audience}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const { audience, ...rest } = activeFilters;
                    setActiveFilters(rest);
                  }}
                />
              </Badge>
            )}
            {activeFilters.featured === 'true' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Featured only
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const { featured, ...rest } = activeFilters;
                    setActiveFilters(rest);
                  }}
                />
              </Badge>
            )}
            {activeFilters.urgent === 'true' && (
              <Badge variant="outline" className="flex items-center gap-1">
                Urgent only
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const { urgent, ...rest } = activeFilters;
                    setActiveFilters(rest);
                  }}
                />
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-6"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {isLoading && announcements.length > 0 && (
        <div className="flex items-center justify-center h-10">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <p className="ml-2 text-sm text-muted-foreground">Updating...</p>
        </div>
      )}

      {sortedAnnouncements.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No announcements found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedAnnouncements.map((announcement) => (
            <Card key={announcement._id} className={`overflow-hidden ${announcement.urgent ? 'border-red-500' : ''}`}>
              {announcement.featured && (
                <div className="bg-primary text-primary-foreground text-xs px-3 py-1">
                  Featured Announcement
                </div>
              )}
              {announcement.urgent && !announcement.featured && (
                <div className="bg-red-500 text-white text-xs px-3 py-1">
                  Urgent
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{announcement.title}</CardTitle>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      <span>{format(new Date(announcement.publishDate), "MMM d, yyyy")}</span>
                      <span>•</span>
                      <span className="capitalize">{announcement.type}</span>
                      <span>•</span>
                      <span className="capitalize">For: {announcement.audience}</span>
                      {announcement.department && (
                        <>
                          <span>•</span>
                          <span>Dept: {announcement.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditDialog(announcement)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500"
                      onClick={() => {
                        setAnnouncementToDelete(announcement);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{announcement.content}</p>
                <div className="flex gap-2 text-sm">
                  {announcement.expiryDate && (
                    <span className="text-muted-foreground">
                      Expires: {format(new Date(announcement.expiryDate), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)} 
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAnnouncement} 
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[580px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details below.
            </DialogDescription>
          </DialogHeader>
          {editingAnnouncement && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  value={updatedAnnouncement.title || ""} 
                  onChange={e => setUpdatedAnnouncement({...updatedAnnouncement, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea 
                  id="edit-content" 
                  rows={5}
                  value={updatedAnnouncement.content || ""} 
                  onChange={e => setUpdatedAnnouncement({...updatedAnnouncement, content: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select 
                    value={updatedAnnouncement.type || "general"} 
                    onValueChange={value => setUpdatedAnnouncement({...updatedAnnouncement, type: value})}
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
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-audience">Audience</Label>
                  <Select 
                    value={updatedAnnouncement.audience || "all"} 
                    onValueChange={value => setUpdatedAnnouncement({...updatedAnnouncement, audience: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="department">Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {updatedAnnouncement.audience === "department" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Select 
                    value={updatedAnnouncement.department || ""} 
                    onValueChange={value => setUpdatedAnnouncement({...updatedAnnouncement, department: value})}
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
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-urgent">Mark as Urgent</Label>
                  <Switch 
                    id="edit-urgent"
                    checked={updatedAnnouncement.urgent || false}
                    onCheckedChange={checked => setUpdatedAnnouncement({...updatedAnnouncement, urgent: checked})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-featured">Feature this Announcement</Label>
                  <Switch 
                    id="edit-featured"
                    checked={updatedAnnouncement.featured || false}
                    onCheckedChange={checked => setUpdatedAnnouncement({...updatedAnnouncement, featured: checked})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-publish-date">Publish Date</Label>
                <Input 
                  id="edit-publish-date" 
                  type="date"
                  value={updatedAnnouncement.publishDate ? format(new Date(updatedAnnouncement.publishDate), "yyyy-MM-dd") : ""} 
                  onChange={e => setUpdatedAnnouncement({...updatedAnnouncement, publishDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-expiry-date">Expiry Date (Optional)</Label>
                <Input 
                  id="edit-expiry-date" 
                  type="date"
                  value={updatedAnnouncement.expiryDate ? format(new Date(updatedAnnouncement.expiryDate), "yyyy-MM-dd") : ""} 
                  onChange={e => setUpdatedAnnouncement({...updatedAnnouncement, expiryDate: e.target.value ? e.target.value : null})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)} 
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditAnnouncement} 
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
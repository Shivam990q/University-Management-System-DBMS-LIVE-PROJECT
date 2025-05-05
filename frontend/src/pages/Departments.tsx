import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen,
  Users,
  GraduationCap,
  BarChart3,
  School,
  Building2,
  Mail,
  Phone,
  Link2,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { departmentsAPI } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State for add/edit department dialog
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentDepartment, setCurrentDepartment] = useState<any>(null);
  const [departmentData, setDepartmentData] = useState({
    name: "",
    code: "",
    established: "",
    hod: "",
    hodEmail: "",
    students: 0,
    faculty: 0,
    courses: 0,
    programs: "",
    description: "",
    location: "",
    contact: "",
    email: "",
    website: ""
  });
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<any>(null);
  
  // State for filters
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  
  useEffect(() => {
    fetchDepartments();
  }, [activeFilters]);
  
  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      let data;
      
      // If there are filters, use the filter method
      if (Object.keys(activeFilters).length > 0) {
        const response = await departmentsAPI.filter(activeFilters);
        data = response.data || [];
      } else {
        data = await departmentsAPI.getAll();
      }
      
      setDepartments(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("Failed to load departments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const openAddDepartmentDialog = () => {
    setDialogMode('add');
    setDepartmentData({
      name: "",
      code: "",
      established: "",
      hod: "",
      hodEmail: "",
      students: 0,
      faculty: 0,
      courses: 0,
      programs: "",
      description: "",
      location: "",
      contact: "",
      email: "",
      website: ""
    });
    setDepartmentDialogOpen(true);
  };
  
  const openEditDepartmentDialog = (department: any) => {
    setDialogMode('edit');
    setCurrentDepartment(department);
    
    // Convert arrays to comma-separated string for editing
    const programsString = Array.isArray(department.programs) 
      ? department.programs.join(", ") 
      : department.programs || "";
      
    setDepartmentData({
      name: department.name || "",
      code: department.code || "",
      established: department.established || "",
      hod: department.hod || "",
      hodEmail: department.hodEmail || "",
      students: department.students || 0,
      faculty: department.faculty || 0,
      courses: department.courses || 0,
      programs: programsString,
      description: department.description || "",
      location: department.location || "",
      contact: department.contact || "",
      email: department.email || "",
      website: department.website || ""
    });
    
    setDepartmentDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setDepartmentData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const numValue = parseInt(value) || 0;
    setDepartmentData(prev => ({
      ...prev,
      [id]: numValue
    }));
  };
  
  const handleSaveDepartment = async () => {
    // Validate required fields
    if (!departmentData.name || !departmentData.code) {
      toast({
        title: "Error",
        description: "Department name and code are required.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Format the data for submission
      const formattedData = {
        ...departmentData,
        // Convert comma-separated programs to array
        programs: departmentData.programs.split(',').map(p => p.trim()),
      };
      
      let response;
      
      if (dialogMode === 'add') {
        response = await departmentsAPI.create(formattedData);
        toast({
          title: "Success",
          description: "Department created successfully!"
        });
      } else {
        response = await departmentsAPI.update(currentDepartment._id, formattedData);
        toast({
          title: "Success",
          description: "Department updated successfully!"
        });
      }
      
      // Refresh the departments list
      fetchDepartments();
      
      // Close the dialog
      setDepartmentDialogOpen(false);
    } catch (error) {
      console.error("Error saving department:", error);
      toast({
        title: "Error",
        description: dialogMode === 'add' 
          ? "Failed to create department. Please try again." 
          : "Failed to update department. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteDepartment = async () => {
    if (!departmentToDelete) return;
    
    try {
      setIsLoading(true);
      await departmentsAPI.delete(departmentToDelete._id);
      
      // Remove from local state
      setDepartments(prev => prev.filter(d => d._id !== departmentToDelete._id));
      
      toast({
        title: "Success",
        description: "Department deleted successfully!"
      });
      
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({
        title: "Error",
        description: "Failed to delete department. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = (filters: any) => {
    setActiveFilters(filters);
    setFilterDialogOpen(false);
  };
  
  const clearFilters = () => {
    setActiveFilters({});
  };
  
  // Filter departments based on search query
  const filteredDepartments = departments.filter(dept => 
    dept.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading && !departments.length) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading departments...</p>
        </div>
      </div>
    );
  }
  
  if (error && !departments.length) {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">
          Academic departments at ITM University
        </p>
      </div>
        <Button onClick={openAddDepartmentDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments..."
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
                <DialogTitle>Filter Departments</DialogTitle>
                <DialogDescription>
                  Set criteria to filter departments
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Department Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., CSE"
                    value={activeFilters.code || ""}
                    onChange={(e) => setActiveFilters({...activeFilters, code: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="search">Search Term</Label>
                  <Input
                    id="search"
                    placeholder="Search in name, code, or description"
                    value={activeFilters.search || ""}
                    onChange={(e) => setActiveFilters({...activeFilters, search: e.target.value})}
                  />
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
        </div>
      </div>
      
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {activeFilters.code && (
              <Badge variant="outline" className="flex items-center gap-1">
                Code: {activeFilters.code}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const { code, ...rest } = activeFilters;
                    setActiveFilters(rest);
                  }}
                />
              </Badge>
            )}
            {activeFilters.search && (
              <Badge variant="outline" className="flex items-center gap-1">
                Search: {activeFilters.search}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    const { search, ...rest } = activeFilters;
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
      
      {isLoading && departments.length > 0 && (
        <div className="flex items-center justify-center h-10">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <p className="ml-2 text-sm text-muted-foreground">Updating...</p>
        </div>
      )}

      {filteredDepartments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No departments found.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <Card key={dept._id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <CardDescription className="mt-1">Code: {dept.code} | Est. {dept.established}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {Array.isArray(dept.programs) ? dept.programs.join(", ") : dept.programs}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-6 space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={`/placeholder.svg?${dept._id}`} alt={dept.hod} />
                    <AvatarFallback>{dept.hod?.split(' ').map((n: string) => n[0]).join('') || 'HD'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{dept.hod}</p>
                  <p className="text-xs text-muted-foreground">Head of Department</p>
                  <p className="text-xs text-primary mt-1">{dept.hodEmail}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <Users className="h-5 w-5 text-blue-500 mb-1" />
                  <p className="text-sm font-medium">{dept.students}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <GraduationCap className="h-5 w-5 text-green-500 mb-1" />
                  <p className="text-sm font-medium">{dept.faculty}</p>
                  <p className="text-xs text-muted-foreground">Faculty</p>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-md">
                  <BookOpen className="h-5 w-5 text-purple-500 mb-1" />
                  <p className="text-sm font-medium">{dept.courses}</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{dept.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{dept.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{dept.email}</span>
                </div>
              </div>
              
                <div className="flex gap-2">
                  <Link to={`/departments/${dept._id}`} className="flex-1">
                <Button className="w-full" variant="outline">
                  <Link2 className="h-4 w-4 mr-2" />
                  View Department
                </Button>
              </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEditDepartmentDialog(dept)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Department
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500"
                        onClick={() => {
                          setDepartmentToDelete(dept);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Department
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
      
      {/* Add/Edit Department Dialog */}
      <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? 'Add New Department' : 'Edit Department'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'add' 
                ? 'Fill in the details for the new department.'
                : 'Update the department information.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Computer Science & Engineering"
                  value={departmentData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Department Code</Label>
                <Input
                  id="code"
                  placeholder="e.g., CSE"
                  value={departmentData.code}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="established">Established Year</Label>
                <Input
                  id="established"
                  placeholder="e.g., 2005"
                  value={departmentData.established}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="programs">Programs Offered</Label>
                <Input
                  id="programs"
                  placeholder="e.g., B.Tech, M.Tech, Ph.D (comma-separated)"
                  value={departmentData.programs}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Department Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the department"
                value={departmentData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hod">Head of Department</Label>
                <Input
                  id="hod"
                  placeholder="e.g., Dr. John Doe"
                  value={departmentData.hod}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hodEmail">HOD Email</Label>
                <Input
                  id="hodEmail"
                  placeholder="e.g., john.doe@university.edu"
                  value={departmentData.hodEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="students">Students Count</Label>
                <Input
                  id="students"
                  type="number"
                  placeholder="e.g., 1250"
                  value={departmentData.students}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty">Faculty Count</Label>
                <Input
                  id="faculty"
                  type="number"
                  placeholder="e.g., 45"
                  value={departmentData.faculty}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="courses">Courses Count</Label>
                <Input
                  id="courses"
                  type="number"
                  placeholder="e.g., 32"
                  value={departmentData.courses}
                  onChange={handleNumberInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Tech Block A, 2nd Floor"
                  value={departmentData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  placeholder="e.g., +91-123-4567890"
                  value={departmentData.contact}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Department Email</Label>
                <Input
                  id="email"
                  placeholder="e.g., cse@university.edu"
                  value={departmentData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="e.g., https://university.edu/cse"
                  value={departmentData.website}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDepartmentDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveDepartment} disabled={isLoading}>
              {isLoading 
                ? dialogMode === 'add' ? 'Creating...' : 'Updating...' 
                : dialogMode === 'add' ? 'Create Department' : 'Update Department'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
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
              onClick={handleDeleteDepartment}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  UserPlus,
  Loader2,
  AlertCircle,
  X,
  ArrowUpDown,
  CheckIcon
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { studentsAPI } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Student {
  _id: string;
  name: string;
  studentId: string;
  department: string;
  enrollmentDate?: string | Date;
  status?: string;
  email: string;
  contactNumber?: string;
  address?: string;
  dateOfBirth?: string | Date;
  gender?: string;
  program?: string;
  gpa?: number;
}

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "suspended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

export default function Students() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredStatus, setFilteredStatus] = useState<string>("all");
  const [filteredDepartment, setFilteredDepartment] = useState<string>("all");
  
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll();
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch students. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setViewDetailsOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    navigate(`/students/edit/${student._id}`, { state: { student } });
  };

  const handleDeleteConfirm = (student: Student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const deleteStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      setIsDeleting(true);
      await studentsAPI.delete(selectedStudent._id);
      
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      
      // Remove from the list without refetching
      setStudents(students.filter(s => s._id !== selectedStudent._id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete student. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.studentId.toLowerCase().includes(search.toLowerCase()) ||
    student.email?.toLowerCase().includes(search.toLowerCase()) ||
    student.department.toLowerCase().includes(search.toLowerCase())
  );
  
  // Format date for display
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get unique departments for filter dropdown
  const departments = [...new Set(students.map(student => student.department))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No students found</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student information and records
          </p>
        </div>
        <Link to="/students/new" className="inline-block">
        <Button className="sm:self-end whitespace-nowrap">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          <div className="w-full sm:w-auto relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
              className="pl-8 w-full sm:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            {search && (
              <Button
                variant="ghost"
                className="absolute right-0 top-0 h-full aspect-square"
                onClick={() => setSearch('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          </div>
          
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle>All Students</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                      <TableHead>Student ID</TableHead>
                  <TableHead>Department</TableHead>
                      <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          Loading students...
                        </TableCell>
                      </TableRow>
                    ) : filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          {search ? "No students found matching your search" : "No students found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                  filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.department}</TableCell>
                          <TableCell>{student.email}</TableCell>
                      <TableCell>
                            <Badge className={getStatusColor(student.status)}>{student.status || "Unknown"}</Badge>
                      </TableCell>
                          <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleViewDetails(student)}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleEditStudent(student)}
                                >
                                  Edit Student
                                </DropdownMenuItem>
                            <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteConfirm(student)}
                                >
                                  Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          {/* Content similar to "all" tab, but filtered for active students */}
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          {/* Content similar to "all" tab, but filtered for inactive students */}
        </TabsContent>
      </Tabs>

      {/* Student Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Complete information for the selected student
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Name</h4>
                  <p className="text-sm">{selectedStudent.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Student ID</h4>
                  <p className="text-sm">{selectedStudent.studentId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Department</h4>
                  <p className="text-sm">{selectedStudent.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Program</h4>
                  <p className="text-sm">{selectedStudent.program || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedStudent.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : selectedStudent.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedStudent.status ? selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1) : 'N/A'}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Enrollment Date</h4>
                  <p className="text-sm">{formatDate(selectedStudent.enrollmentDate)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p className="text-sm">{selectedStudent.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Contact Number</h4>
                  <p className="text-sm">{selectedStudent.contactNumber || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Date of Birth</h4>
                  <p className="text-sm">{formatDate(selectedStudent.dateOfBirth)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Gender</h4>
                  <p className="text-sm">{selectedStudent.gender ? selectedStudent.gender.charAt(0).toUpperCase() + selectedStudent.gender.slice(1) : "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">GPA</h4>
                  <p className="text-sm">{selectedStudent.gpa || "N/A"}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Address</h4>
                <p className="text-sm">{selectedStudent.address || "N/A"}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDetailsOpen(false)}>Close</Button>
            <Button variant="outline" onClick={() => {
              setViewDetailsOpen(false);
              if (selectedStudent) handleEditStudent(selectedStudent);
            }}>
              Edit Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student 
              record and remove the data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                deleteStudent();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

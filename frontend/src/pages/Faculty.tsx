
import { useState } from "react";
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
  Mail,
  Phone,
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Faculty {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "Active" | "On Leave" | "Terminated";
  expertise: string[];
}

const faculty: Faculty[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    employeeId: "ITMUF001",
    department: "Computer Science",
    designation: "Professor & HOD",
    email: "rajesh.kumar@itmu.edu",
    phone: "+91 98765 43210",
    joinDate: "2015-06-10",
    status: "Active",
    expertise: ["Artificial Intelligence", "Machine Learning", "Data Science"],
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    employeeId: "ITMUF002",
    department: "Electrical Engineering",
    designation: "Associate Professor",
    email: "priya.sharma@itmu.edu",
    phone: "+91 98765 43211",
    joinDate: "2016-07-15",
    status: "Active",
    expertise: ["Power Systems", "Renewable Energy", "Control Systems"],
  },
  {
    id: "3",
    name: "Dr. Sunil Mehta",
    employeeId: "ITMUF003",
    department: "Mechanical Engineering",
    designation: "Professor",
    email: "sunil.mehta@itmu.edu",
    phone: "+91 98765 43212",
    joinDate: "2014-08-20",
    status: "Active",
    expertise: ["Thermal Engineering", "Fluid Mechanics", "Robotics"],
  },
  {
    id: "4",
    name: "Prof. Anjali Gupta",
    employeeId: "ITMUF004",
    department: "Computer Science",
    designation: "Assistant Professor",
    email: "anjali.gupta@itmu.edu",
    phone: "+91 98765 43213",
    joinDate: "2018-09-05",
    status: "On Leave",
    expertise: ["Web Development", "Cybersecurity", "Cloud Computing"],
  },
  {
    id: "5",
    name: "Dr. Vikram Yadav",
    employeeId: "ITMUF005",
    department: "Civil Engineering",
    designation: "Professor",
    email: "vikram.yadav@itmu.edu",
    phone: "+91 98765 43214",
    joinDate: "2015-10-15",
    status: "Active",
    expertise: ["Structural Engineering", "Construction Management", "Environmental Engineering"],
  },
  {
    id: "6",
    name: "Dr. Meena Singh",
    employeeId: "ITMUF006",
    department: "Business Administration",
    designation: "Professor",
    email: "meena.singh@itmu.edu",
    phone: "+91 98765 43215",
    joinDate: "2016-11-20",
    status: "Active",
    expertise: ["Financial Management", "Marketing", "Entrepreneurship"],
  },
  {
    id: "7",
    name: "Prof. Rahul Verma",
    employeeId: "ITMUF007",
    department: "Computer Science",
    designation: "Assistant Professor",
    email: "rahul.verma@itmu.edu",
    phone: "+91 98765 43216",
    joinDate: "2019-12-10",
    status: "Active",
    expertise: ["Database Systems", "Software Engineering", "Algorithms"],
  },
  {
    id: "8",
    name: "Dr. Neha Kapoor",
    employeeId: "ITMUF008",
    department: "Electrical Engineering",
    designation: "Associate Professor",
    email: "neha.kapoor@itmu.edu",
    phone: "+91 98765 43217",
    joinDate: "2017-01-15",
    status: "Active",
    expertise: ["Communication Systems", "Signal Processing", "VLSI Design"],
  },
];

export default function Faculty() {
  const [search, setSearch] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState<string>("all");
  const [filteredDesignation, setFilteredDesignation] = useState<string>("all");
  
  const filteredFaculty = faculty.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) || 
                          member.employeeId.toLowerCase().includes(search.toLowerCase()) ||
                          member.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesDepartment = filteredDepartment === "all" || 
                              member.department === filteredDepartment;
    
    const matchesDesignation = filteredDesignation === "all" || 
                               member.designation === filteredDesignation;
    
    return matchesSearch && matchesDepartment && matchesDesignation;
  });
  
  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Faculty</h1>
          <p className="text-muted-foreground">
            Manage faculty members and academic staff
          </p>
        </div>
        <Button className="sm:self-end whitespace-nowrap">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Faculty Directory</CardTitle>
          <CardDescription>
            View and manage faculty and teaching staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search faculty..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-1 gap-4">
              <div className="w-full md:w-1/2">
                <Select
                  value={filteredDepartment}
                  onValueChange={setFilteredDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Business Administration">Business Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-1/2">
                <Select
                  value={filteredDesignation}
                  onValueChange={setFilteredDesignation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Designations</SelectItem>
                    <SelectItem value="Professor & HOD">Professor & HOD</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.length > 0 ? (
                  filteredFaculty.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {member.expertise.join(", ")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.employeeId}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.designation}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-xs">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </div>
                          <div className="flex items-center text-xs mt-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {member.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${
                              member.status === "Active"
                                ? "bg-green-500"
                                : member.status === "On Leave"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          {member.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>View Schedule</DropdownMenuItem>
                            <DropdownMenuItem>Performance Review</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No faculty members found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-{filteredFaculty.length}</strong> of{" "}
                <strong>{filteredFaculty.length}</strong> faculty members
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  1
                </Button>
                <Button variant="outline" size="icon" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

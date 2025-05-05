import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Search, Building2, Users, BookOpen } from "lucide-react";
import { departmentsAPI } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Department {
  _id: string;
  name: string;
  code: string;
  established?: string;
  hod?: string;
  hodEmail?: string;
  students?: number;
  faculty?: number;
  courses?: number;
  programs?: string[];
  description?: string;
  location?: string;
  contact?: string;
  email?: string;
  website?: string;
}

export default function Departments() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("grid");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentsAPI.getAll();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: "Failed to load departments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    department.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage academic departments and their details
          </p>
        </div>
        <Button onClick={() => navigate("/departments/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs
          defaultValue="grid"
          value={activeView}
          onValueChange={setActiveView}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <TabsContent value="grid" className="m-0">
          {filteredDepartments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No departments found</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                {searchQuery
                  ? "No departments match your search criteria."
                  : "There are no departments in the system yet."}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate("/departments/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Department
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments.map((department) => (
                <Card
                  key={department._id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/departments/${department._id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{department.name}</CardTitle>
                      <Avatar className="h-8 w-8 text-xs">
                        <AvatarFallback>{getInitials(department.code)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <CardDescription>{department.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {department.established && (
                        <div className="text-sm">
                          Est. {department.established}
                        </div>
                      )}
                      {department.hod && (
                        <div className="text-sm">
                          HOD: {department.hod}
                        </div>
                      )}
                      <div className="flex gap-4 text-sm mt-4">
                        {department.students !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{department.students}</span>
                          </div>
                        )}
                        {department.faculty !== undefined && (
                          <div className="flex items-center gap-1 ml-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{department.faculty}</span>
                          </div>
                        )}
                        {department.courses !== undefined && (
                          <div className="flex items-center gap-1 ml-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{department.courses}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      )}

      <TabsContent value="list" className="m-0">
        {filteredDepartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No departments found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {searchQuery
                ? "No departments match your search criteria."
                : "There are no departments in the system yet."}
            </p>
            {!searchQuery && (
              <Button onClick={() => navigate("/departments/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredDepartments.map((department) => (
                  <div
                    key={department._id}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/departments/${department._id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(department.code)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{department.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {department.code}
                          {department.established && ` • Est. ${department.established}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {department.students !== undefined && (
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">{department.students}</div>
                          <div className="text-xs text-muted-foreground">Students</div>
                        </div>
                      )}
                      {department.faculty !== undefined && (
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">{department.faculty}</div>
                          <div className="text-xs text-muted-foreground">Faculty</div>
                        </div>
                      )}
                      {department.courses !== undefined && (
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium">{department.courses}</div>
                          <div className="text-xs text-muted-foreground">Courses</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </div>
  );
} 
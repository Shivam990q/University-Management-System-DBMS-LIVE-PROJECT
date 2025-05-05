
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DepartmentStatsProps {
  departments: {
    name: string;
    students: number;
    faculty: number;
    courses: number;
    color: string;
  }[];
}

export function DepartmentStats({ departments }: DepartmentStatsProps) {
  // Find the max student count for progress calculation
  const maxStudents = Math.max(...departments.map(d => d.students));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Statistics</CardTitle>
        <CardDescription>Overview of faculties and students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {departments.map((dept) => (
            <div key={dept.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{dept.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{dept.students} Students</span>
                    <span>{dept.faculty} Faculty</span>
                    <span>{dept.courses} Courses</span>
                  </div>
                </div>
              </div>
              <Progress 
                value={(dept.students / maxStudents) * 100} 
                className={`h-2 ${dept.color}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

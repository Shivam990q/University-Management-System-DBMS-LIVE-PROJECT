
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { EnrollmentChart } from "@/components/dashboard/EnrollmentChart";
import { DepartmentStats } from "@/components/dashboard/DepartmentStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { CurrentSemester } from "@/components/dashboard/CurrentSemester";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Building2,
  School
} from "lucide-react";

const departments = [
  {
    name: "Computer Science & Engineering",
    students: 1250,
    faculty: 45,
    courses: 32,
    color: "bg-blue-500",
  },
  {
    name: "Electrical & Electronics Engineering",
    students: 980,
    faculty: 38,
    courses: 28,
    color: "bg-green-500",
  },
  {
    name: "Mechanical Engineering",
    students: 850,
    faculty: 35,
    courses: 26,
    color: "bg-yellow-500",
  },
  {
    name: "Civil Engineering",
    students: 720,
    faculty: 30,
    courses: 24,
    color: "bg-purple-500",
  },
  {
    name: "Business Administration",
    students: 900,
    faculty: 32,
    courses: 27,
    color: "bg-red-500",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to ITM University Management System
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="5,234"
          description="Active enrollments across all programs"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Faculty Members"
          value="248"
          description="Full-time and part-time instructors"
          icon={GraduationCap}
          trend={{ value: 4, isPositive: true }}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Total Courses"
          value="183"
          description="Active courses this semester"
          icon={BookOpen}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Departments"
          value="12"
          description="Academic and administrative departments"
          icon={Building2}
          iconColor="text-purple-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EnrollmentChart />
        <RecentActivity />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DepartmentStats departments={departments} />
        <QuickActions />
        <CurrentSemester />
      </div>
    </div>
  );
}

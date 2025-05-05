import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Timetable from "./pages/Timetable";
import Examinations from "./pages/Examinations";
import Departments from "./pages/Departments";
import Settings from "./pages/Settings";
import Admissions from "./pages/students/Admissions";
import Attendance from "./pages/students/Attendance";
import Schedule from "./pages/courses/Schedule";
import AddStudent from "./pages/students/AddStudent";
import EditStudent from "./pages/students/EditStudent";
import AddCourse from "./pages/courses/AddCourse";
import CreateExam from "./pages/examinations/CreateExam";
import CreateAnnouncement from "./pages/announcements/CreateAnnouncement";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import DepartmentDetail from "./pages/DepartmentDetail";
import CreateExamination from "./pages/examinations/CreateExamination";
import Announcements from "./pages/Announcements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Student Routes */}
            <Route path="/students" element={<Students />} />
            <Route path="/students/admissions" element={<Admissions />} />
            <Route path="/students/attendance" element={<Attendance />} />
            <Route path="/students/new" element={<AddStudent />} />
            <Route path="/students/edit/:id" element={<EditStudent />} />
            
            {/* Faculty Routes */}
            <Route path="/faculty" element={<Faculty />} />
            
            {/* Course Routes */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/schedule" element={<Schedule />} />
            <Route path="/courses/new" element={<AddCourse />} />
            
            {/* Examination Routes */}
            <Route path="/examinations" element={<Examinations />} />
            <Route path="/examinations/new" element={<CreateExamination />} />
            
            {/* Announcement Routes */}
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/announcements/new" element={<CreateAnnouncement />} />
            
            {/* Other Routes */}
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/departments/:id" element={<DepartmentDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="/index" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays } from "lucide-react";

export function CurrentSemester() {
  // Mock data for the current semester
  const semester = {
    name: "Spring 2025",
    startDate: "January 15, 2025",
    endDate: "May 20, 2025",
    progress: 45, // percentage completed
    daysLeft: 65,
    totalDays: 125,
    upcomingEvents: [
      { date: "April 10", event: "Mid-semester exams begin" },
      { date: "April 20", event: "Registration for next semester" },
      { date: "May 1", event: "Last date for project submission" },
    ],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Current Semester
        </CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{semester.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {semester.startDate} - {semester.endDate}
            </p>
          </div>
          <Button variant="outline" size="sm">
            Calendar
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Progress</span>
            <span>{semester.progress}%</span>
          </div>
          <Progress value={semester.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {semester.daysLeft} days left of {semester.totalDays} total days
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Upcoming Events</h3>
          <div className="space-y-2">
            {semester.upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-xs p-2 rounded-md bg-secondary"
              >
                <div className="font-semibold min-w-14">{event.date}</div>
                <div>{event.event}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

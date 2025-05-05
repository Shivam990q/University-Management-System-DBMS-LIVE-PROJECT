
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Download, Filter } from "lucide-react";

export default function Timetable() {
  const [activeDay, setActiveDay] = useState("monday");
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  
  const timeSlots = [
    { time: "09:00 - 10:00", classes: { monday: "CSE-101: Introduction to Computing (Room: LH-1)", tuesday: "MTH-103: Discrete Mathematics (Room: LH-3)", wednesday: "CSE-101: Introduction to Computing (Room: LH-1)", thursday: "PHY-101: Engineering Physics (Room: LH-2)", friday: "MTH-103: Discrete Mathematics (Room: LH-3)", saturday: null } },
    { time: "10:00 - 11:00", classes: { monday: "ENG-101: Technical Communication (Room: LH-4)", tuesday: "PHY-101: Engineering Physics (Room: LH-2)", wednesday: "CSE-103: Programming with Python (Room: LH-5)", thursday: "ENG-101: Technical Communication (Room: LH-4)", friday: null, saturday: "CSE-103: Programming with Python (Room: LH-5)" } },
    { time: "11:00 - 12:00", classes: { monday: "MTH-101: Calculus (Room: LH-3)", tuesday: "CSE-103: Programming with Python (Room: LH-5)", wednesday: "MTH-101: Calculus (Room: LH-3)", thursday: null, friday: "PHY-101: Engineering Physics Lab (Room: Lab-1)", saturday: null } },
    { time: "12:00 - 13:00", classes: { monday: "Lunch Break", tuesday: "Lunch Break", wednesday: "Lunch Break", thursday: "Lunch Break", friday: "Lunch Break", saturday: "Lunch Break" } },
    { time: "13:00 - 14:00", classes: { monday: "CSE-105: Digital Logic Design (Room: LH-6)", tuesday: null, wednesday: "CSE-105: Digital Logic Design (Room: LH-6)", thursday: "CSE-107: Data Structures (Room: LH-1)", friday: null, saturday: "CSE-107: Data Structures (Room: LH-1)" } },
    { time: "14:00 - 15:00", classes: { monday: "CSE-107: Data Structures (Room: LH-1)", tuesday: "CSE-109: Database Systems (Room: LH-7)", wednesday: null, thursday: "CSE-109: Database Systems (Room: LH-7)", friday: "CSE-105: Digital Logic Design Lab (Room: Lab-2)", saturday: null } },
    { time: "15:00 - 16:00", classes: { monday: null, tuesday: "CSE-111: Object Oriented Programming (Room: LH-8)", wednesday: "CSE-111: Object Oriented Programming (Room: LH-8)", thursday: null, friday: "CSE-107: Data Structures Lab (Room: Lab-3)", saturday: null } },
    { time: "16:00 - 17:00", classes: { monday: "CSE-111: Object Oriented Programming (Room: LH-8)", tuesday: null, wednesday: null, thursday: "CSE-109: Database Systems Lab (Room: Lab-4)", friday: null, saturday: null } },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">
            View and manage class schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Weekly Schedule</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="cse-3">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse-1">CSE - Semester 1</SelectItem>
                    <SelectItem value="cse-2">CSE - Semester 2</SelectItem>
                    <SelectItem value="cse-3">CSE - Semester 3</SelectItem>
                    <SelectItem value="cse-4">CSE - Semester 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeDay} onValueChange={setActiveDay} className="w-full">
              <TabsList className="w-full grid grid-cols-3 md:grid-cols-6">
                {days.map((day) => (
                  <TabsTrigger key={day} value={day} className="capitalize">
                    {day.slice(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {days.map((day) => (
                <TabsContent key={day} value={day} className="mt-4">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-[1fr_2fr] py-2 px-4 bg-muted/50">
                      <div className="font-medium flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Time
                      </div>
                      <div className="font-medium flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Class
                      </div>
                    </div>
                    {timeSlots.map((slot, index) => (
                      <div 
                        key={index} 
                        className={`grid grid-cols-[1fr_2fr] py-3 px-4 ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        } ${slot.time === "12:00 - 13:00" ? "bg-muted/30" : ""}`}
                      >
                        <div className="text-sm">{slot.time}</div>
                        <div className={`text-sm ${!slot.classes[day] ? "text-muted-foreground italic" : ""}`}>
                          {slot.classes[day] || "No Class"}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

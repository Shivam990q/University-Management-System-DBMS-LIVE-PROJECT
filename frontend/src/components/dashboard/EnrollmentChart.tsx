
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const data = [
  { name: "Jan", CSE: 65, ECE: 28, Mechanical: 38, Civil: 20 },
  { name: "Feb", CSE: 59, ECE: 48, Mechanical: 43, Civil: 25 },
  { name: "Mar", CSE: 80, ECE: 40, Mechanical: 45, Civil: 30 },
  { name: "Apr", CSE: 81, ECE: 47, Mechanical: 50, Civil: 35 },
  { name: "May", CSE: 56, ECE: 65, Mechanical: 55, Civil: 40 },
  { name: "Jun", CSE: 55, ECE: 58, Mechanical: 60, Civil: 45 },
  { name: "Jul", CSE: 40, ECE: 44, Mechanical: 65, Civil: 50 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const totalsByDepartment = {
  CSE: data.reduce((sum, item) => sum + item.CSE, 0),
  ECE: data.reduce((sum, item) => sum + item.ECE, 0), 
  Mechanical: data.reduce((sum, item) => sum + item.Mechanical, 0),
  Civil: data.reduce((sum, item) => sum + item.Civil, 0)
};

const pieData = Object.entries(totalsByDepartment).map(([name, value]) => ({
  name,
  value
}));

export function EnrollmentChart() {
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("All");
  
  const filteredData = timeRange === "All" 
    ? data 
    : timeRange === "Q1" 
      ? data.slice(0, 3) 
      : timeRange === "Q2" 
        ? data.slice(3, 6)
        : data.slice(6);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Student Enrollment Trends</CardTitle>
          <CardDescription>Monthly enrollment by department for 2025</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="line" onValueChange={setChartType} className="w-fit">
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="line" className="text-xs">Line</TabsTrigger>
              <TabsTrigger value="bar" className="text-xs">Bar</TabsTrigger>
              <TabsTrigger value="pie" className="text-xs">Pie</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                {timeRange}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("All")}>
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("Q1")}>
                Q1 (Jan-Mar)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("Q2")}>
                Q2 (Apr-Jun)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("Q3")}>
                Q3 (Jul)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="CSE"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="ECE"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Mechanical"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Civil"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            ) : chartType === "bar" ? (
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="CSE" fill="#3b82f6" />
                <Bar dataKey="ECE" fill="#10b981" />
                <Bar dataKey="Mechanical" fill="#f59e0b" />
                <Bar dataKey="Civil" fill="#6366f1" />
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, "Total Enrollment"]}
                  contentStyle={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          {Object.entries(totalsByDepartment).map(([dept, total], index) => (
            <div key={dept} className="bg-muted rounded-md p-2">
              <div className="text-sm font-medium">{dept}</div>
              <div className="text-2xl font-bold" style={{ color: COLORS[index] }}>{total}</div>
              <div className="text-xs text-muted-foreground">Total Students</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

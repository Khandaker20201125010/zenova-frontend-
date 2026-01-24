"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"


const userData = [
  { month: "Jan", users: 400, newUsers: 240 },
  { month: "Feb", users: 700, newUsers: 139 },
  { month: "Mar", users: 1000, newUsers: 200 },
  { month: "Apr", users: 1200, newUsers: 278 },
  { month: "May", users: 1500, newUsers: 189 },
  { month: "Jun", users: 1800, newUsers: 239 },
  { month: "Jul", users: 2200, newUsers: 349 },
  { month: "Aug", users: 2500, newUsers: 430 },
  { month: "Sep", users: 3000, newUsers: 200 },
  { month: "Oct", users: 3500, newUsers: 278 },
  { month: "Nov", users: 4000, newUsers: 189 },
  { month: "Dec", users: 4500, newUsers: 239 },
]

export function UserGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New user registrations and total users</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="newUsers" 
              name="New Users"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="users" 
              name="Total Users"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
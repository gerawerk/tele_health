'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, FileText, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PatientDashboard() {
  const { data: session } = useSession();

  if (!session || session.user.role !== 'patient') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session.user.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-600">Your health dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Next: Tomorrow at 10 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Good overall health</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Documents available</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button className="justify-start h-auto p-4" variant="outline" asChild>
                  <Link href="/dashboard/patient/appointments">
                    <Calendar className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Book Appointment</div>
                      <div className="text-sm text-gray-600">Schedule with a doctor</div>
                    </div>
                  </Link>
                </Button>

                <Button className="justify-start h-auto p-4" variant="outline">
                  <Heart className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Health Checkup</div>
                    <div className="text-sm text-gray-600">Track your vitals</div>
                  </div>
                </Button>

                <Button className="justify-start h-auto p-4" variant="outline">
                  <FileText className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Medical Records</div>
                    <div className="text-sm text-gray-600">View your history</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        Dr. {i === 1 ? 'S' : i === 2 ? 'J' : 'M'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        Dr. {i === 1 ? 'Smith' : i === 2 ? 'Johnson' : 'Miller'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {i === 1 ? 'Jan 15, 2025' : i === 2 ? 'Jan 10, 2025' : 'Jan 5, 2025'} - 
                        {i === 1 ? ' Cardiology' : i === 2 ? ' General' : ' Dermatology'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      i === 1 ? 'bg-green-100 text-green-800' : 
                      i === 2 ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {i === 1 ? 'Completed' : i === 2 ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
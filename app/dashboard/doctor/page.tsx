"use client"

import * as React from "react"
import { Calendar, MessageSquare, Users, FileText } from "lucide-react"
import { AppSidebar } from "@/components/doctorsidebar"
import { AppNavbar } from "@/components/doctorNAvbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = React.useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6 ">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-600">Dashboard content will go here...</p>
          </div>
        )
      case "appointments":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Appointments</h2>
            <p className="text-gray-600">Appointments content will go here...</p>
          </div>
        )
      case "messages":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Messages</h2>
            <p className="text-gray-600">Messages content will go here...</p>
          </div>
        )
      case "patients":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Patients</h2>
            <p className="text-gray-600">Patients content will go here...</p>
          </div>
        )
      case "prescriptions":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Prescriptions</h2>
            <p className="text-gray-600">Prescriptions content will go here...</p>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-gray-600">Dashboard content will go here...</p>
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <AppNavbar />
        <main className="flex-1 p-6 bg-gray-50 ">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
    
  )
}

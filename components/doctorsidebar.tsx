"use client"
import { Calendar, MessageSquare, Users, FileText, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const sidebarItems = [
  { title: "Dashboard", icon: Calendar, id: "dashboard" },
  { title: "Appointments", icon: Calendar, id: "appointments" },
  { title: "Messages", icon: MessageSquare, id: "messages" },
  { title: "Patients", icon: Users, id: "patients" },
  { title: "Prescriptions", icon: FileText, id: "prescriptions" },
]

interface AppSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200 shadow-lg">
      <SidebarHeader className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">TeleHealth</h2>
            <p className="text-sm text-gray-600">Doctor Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => onTabChange(item.id)}
                isActive={activeTab === item.id}
                className="w-full justify-start"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

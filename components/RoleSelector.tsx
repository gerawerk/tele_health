'use client';

import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: 'doctor' | 'patient' | null;
  onRoleSelect: (role: 'doctor' | 'patient') => void;
}

export default function RoleSelector({ selectedRole, onRoleSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          selectedRole === 'doctor' && "ring-2 ring-blue-600 bg-blue-50"
        )}
        onClick={() => onRoleSelect('doctor')}
      >
        <CardContent className="p-6 text-center">
          <UserCheck className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">I'm a Doctor</h3>
          <p className="text-gray-600 text-sm">
            Provide medical consultations and manage patient appointments
          </p>
        </CardContent>
      </Card>

      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-md",
          selectedRole === 'patient' && "ring-2 ring-green-600 bg-green-50"
        )}
        onClick={() => onRoleSelect('patient')}
      >
        <CardContent className="p-6 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <h3 className="text-lg font-semibold mb-2">I'm a Patient</h3>
          <p className="text-gray-600 text-sm">
            Book appointments and consult with healthcare providers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
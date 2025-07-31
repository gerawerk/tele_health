'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import RoleSelector from '@/components/RoleSelector';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient' | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'doctor' || roleParam === 'patient') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/auth/signup/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join TeleHealth
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose your role to get started
          </p>
        </div>

        <RoleSelector 
          selectedRole={selectedRole} 
          onRoleSelect={setSelectedRole} 
        />

        {selectedRole && (
          <div className="flex flex-col items-center space-y-4">
            <Button onClick={handleContinue} className="w-full max-w-sm">
              Continue as {selectedRole === 'doctor' ? 'Doctor' : 'Patient'}
            </Button>
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
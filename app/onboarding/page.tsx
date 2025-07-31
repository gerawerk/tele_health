'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User, Stethoscope, Calendar as CalendarIconLucide } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: undefined as Date | undefined,
    role: ''
  });

  useEffect(() => {
    // Redirect if profile is already complete
    if (session?.user.profileComplete) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleSubmit = async () => {
    if (!formData.gender || !formData.dateOfBirth || !formData.role) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Update the session
        await update({
          profileComplete: true,
          role: formData.role
        });
        
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error completing profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const RoleCard = ({ role, title, description, icon, selected, onClick }: {
    role: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    selected: boolean;
    onClick: () => void;
  }) => (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        selected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={cn(
          "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
          selected ? "bg-primary text-white" : "bg-gray-100 text-gray-600"
        )}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <p className="text-gray-600 mt-2">
            Welcome {session.user.name}! Let's set up your account.
          </p>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-8 h-2 rounded-full",
                    i <= step ? "bg-primary" : "bg-gray-200"
                  )}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="gender" className="text-base font-medium">Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button 
                onClick={() => setStep(2)} 
                disabled={!formData.gender}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-3",
                        !formData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                      initialFocus
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!formData.dateOfBirth}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">I am joining as a...</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RoleCard
                    role="patient"
                    title="Patient"
                    description="I'm looking for healthcare services and want to book appointments"
                    icon={<User size={24} />}
                    selected={formData.role === 'patient'}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'patient' }))}
                  />
                  <RoleCard
                    role="doctor"
                    title="Doctor"
                    description="I'm a healthcare provider and want to offer my services"
                    icon={<Stethoscope size={24} />}
                    selected={formData.role === 'doctor'}
                    onClick={() => setFormData(prev => ({ ...prev, role: 'doctor' }))}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.role || loading}
                  className="flex-1"
                >
                  {loading ? 'Completing...' : 'Complete Setup'}
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-center pt-4 border-t">
            <Button 
              variant="ghost" 
              onClick={() => signOut()}
              className="text-sm text-gray-500"
            >
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
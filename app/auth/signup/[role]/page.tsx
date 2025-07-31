'use client';

import { useState, useEffect } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Hospital, Eye, EyeOff, UserPlus } from 'lucide-react';
import { signUpSchema, SignUpInput } from '@/lib/validations/auth';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

   useEffect(() => {
      const checkSession = async () => {
        const session = await getSession();
        if (session) {
          if (!session.user.profileComplete) {
            router.push('/onboarding');
          } else if (session.user.role==='patient') {
            router.push('/dashboard/patient');
          } else 
          {
            router.push('/dashboard/doctor'); }    
         }
      };
  
      checkSession();
    }, [router]);
  
  // Pagination content for the left section
  const slides = [
    {
      title: 'Welcome to Debretabor Hospital',
      description: 'Connect with qualified healthcare providers for secure, convenient online consultations from the comfort of your home.',
    },
    {
      title: 'Trusted Telemedicine',
      description: 'Access professional medical advice anytime, anywhere, with our privacy-first platform designed for your health needs.',
    },
    {
      title: 'Easy & Secure',
      description: 'Enjoy seamless appointment booking and encrypted data protection, ensuring your privacy and peace of mind.',
    },
  ];

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      dateOfBirth: '',
      gender: undefined,
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Account created successfully!');
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push('/patient/dashboard');
        } else {
          router.push('/signin');
        }
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn('google');
    } catch (error) {
      toast.error('Google sign-up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-start justify-start bg-black/30 backdrop-blur-sm bg-cover bg-center p-4 sm:p-6 gap-6 lg:gap-8"
      style={{
        backgroundImage: 'url(https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1)',
      }}
    >
      {/* Left Section: About with Pagination */}
      <div className="w-full lg:w-[70%] lg:max-w-[900px] flex items-start justify-center">
        <div className="relative w-full h-[400px] sm:h-[450px] rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm">
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <Hospital className="h-8 w-8 text-white" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{slides[currentSlide].title}</h1>
            </div>
            <p className="text-sm sm:text-base text-white mb-8 max-w-lg leading-relaxed">{slides[currentSlide].description}</p>
            
            {/* Pagination Dots */}
            <div className="flex justify-center space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Sign-Up Form */}
      <div className="w-full lg:w-[30%] flex items-start justify-center">
        <Card className="w-full max-w-[450px] sm:max-w-[500px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-xl">
          <CardHeader className="text-center pt-4 pb-2">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl font-bold text-gray-900">Create Account</CardTitle>
            </div>
            <p className="text-gray-600 text-sm">Join our healthcare community</p>
          </CardHeader>
          
          <CardContent className="space-y-2 px-4 sm:px-6">
            <Button
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full h-9 border-2 border-gray-200 hover:bg-gray-50 text-sm font-medium transition-all duration-200 rounded-md"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isLoading ? 'Signing up...' : 'Google Sign Up'}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 font-medium">Or sign up with email</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First name"
                            className="h-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last name"
                            className="h-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="h-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            className="h-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-8"
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-8 px-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                      <p className="text-xs text-gray-500 mt-0.5">6+ characters</p>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+251..."
                          className="h-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="h-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={isLoading} className="h-8 text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-1">
                  <Button 
                    type="submit" 
                    className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-all duration-200" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </Form>
            
            <div className="text-center text-xs pt-2 border-t border-gray-200">
              <span className="text-gray-600">Have an account? </span>
              <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
            
            <div className="text-center text-xs text-gray-500 pt-1">
              <p>By signing up, you agree to our <span className="font-medium">Terms</span> and <span className="font-medium">Privacy Policy</span>.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
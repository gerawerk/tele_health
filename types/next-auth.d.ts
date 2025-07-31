import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isNewUser: boolean;
      profileComplete: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: string;
    isNewUser: boolean;
    profileComplete: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    role: string;
    isNewUser: boolean;
    profileComplete: boolean;
  }
}
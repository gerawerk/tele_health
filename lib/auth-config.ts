import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from './db';
import {User} from './models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.isActive) return null;

        const isValidPassword = await user.comparePassword(credentials.password);
        if (!isValidPassword) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          image: user.profileImage,
          isNewUser: false,
          profileComplete: !!(user.dateOfBirth && user.gender && user.role)
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await dbConnect();
        
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create minimal user record
          const names = user.name?.split(' ') || ['', ''];
          const newUser = await User.create({
            email: user.email,
            firstName: names[0],
            lastName: names.slice(1).join(' ') || names[0],
            googleId: account.providerAccountId,
            profileImage: user.image,
            emailVerified: true,
            // Don't set role, gender, dateOfBirth yet - will be set in onboarding
          });
          
          // Mark as new user for redirect
          user.isNewUser = true;
          user.profileComplete = false;
          user.id = newUser._id.toString();
        } else {
          existingUser.googleId = account.providerAccountId;
          existingUser.emailVerified = true;
          if (!existingUser.profileImage) {
            existingUser.profileImage = user.image;
          }
          await existingUser.save();
          
          user.isNewUser = false;
          user.profileComplete = !!(existingUser.dateOfBirth && existingUser.gender && existingUser.role);
          user.id = existingUser._id.toString();
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.userId = dbUser._id.toString();
          token.isNewUser = user.isNewUser || false;
          token.profileComplete = !!(dbUser.dateOfBirth && dbUser.gender && dbUser.role);
        }
      }
      
      // Handle session updates (when profile is completed)
      if (trigger === 'update' && session) {
        token.profileComplete = session.profileComplete;
        token.role = session.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.isNewUser = token.isNewUser as boolean;
        session.user.profileComplete = token.profileComplete as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If user is new or profile incomplete, redirect to onboarding
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/onboarding`;
      }
      
      // Allow relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};
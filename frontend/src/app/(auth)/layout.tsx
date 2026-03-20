// src/app/(auth)/layout.tsx
import { AuthProvider } from '@/context/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-700">TaskFlow</h1>
            <p className="text-gray-500 mt-1">Stay organised, stay ahead</p>
          </div>
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}

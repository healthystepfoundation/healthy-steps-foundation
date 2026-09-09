import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-warm-gray-100 p-8">
        <h1 className="text-xl font-bold font-serif text-warm-gray-900 mb-1">Staff Login</h1>
        <p className="text-sm text-warm-gray-500 mb-6">
          Healthy Steps Foundation donation records
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

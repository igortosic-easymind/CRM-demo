// src/app/page.tsx
import Link from "next/link";
import { ArrowRight, Users, BarChart2, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">Easymindstudio CRM</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </header>

        {/* Main Content */}
        <main className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">Welcome to Your Business Hub</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Streamline your client relationships with our comprehensive CRM solution. Track leads, manage contacts, and
            grow your business efficiently.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <Users className="h-12 w-12 mb-4 mx-auto text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Client Management</h2>
              <p className="text-gray-600">Keep track of all your clients and leads in one place</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <BarChart2 className="h-12 w-12 mb-4 mx-auto text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Analytics</h2>
              <p className="text-gray-600">Gain insights from detailed business analytics</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <Calendar className="h-12 w-12 mb-4 mx-auto text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Task Planning</h2>
              <p className="text-gray-600">Schedule and track follow-ups and meetings</p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-600">
          <p className="mb-4">
            Powered by{" "}
            <a
              href="https://www.easymindstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Easymindstudio
            </a>
          </p>
          <div className="text-sm">© {new Date().getFullYear()} All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}

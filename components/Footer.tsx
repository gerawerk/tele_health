import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">TeleHealth</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Connecting patients with healthcare providers through secure, 
              convenient, and affordable telemedicine services.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Patients</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/signup?role=patient" className="hover:text-white">Book Appointment</Link></li>
              <li><Link href="/" className="hover:text-white">Find Doctors</Link></li>
              <li><Link href="/" className="hover:text-white">Health Records</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Doctors</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/signup?role=doctor" className="hover:text-white">Join Platform</Link></li>
              <li><Link href="/" className="hover:text-white">Manage Practice</Link></li>
              <li><Link href="/" className="hover:text-white">Patient Portal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2025 TeleHealth. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link href="/" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link href="/" className="text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
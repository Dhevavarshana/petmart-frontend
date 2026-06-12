import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow">
              <svg width="18" height="18" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="58" r="22" fill="white"/>
                <circle cx="28" cy="36" r="11" fill="white"/>
                <circle cx="50" cy="28" r="11" fill="white"/>
                <circle cx="72" cy="36" r="11" fill="white"/>
                <circle cx="82" cy="56" r="9" fill="white"/>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-orange-400">Pet</span><span className="text-white">Mart</span>
            </span>
          </div>
          <p className="text-sm">Your one-stop destination for pet shopping, adoption, and care.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/pets', 'Pets'], ['/products', 'Store'], ['/adopt', 'Adopt']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-orange-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            {[['/appointments', 'Vet Booking'], ['/appointments', 'Grooming'], ['/blog', 'Pet Care Blog']].map(([to, label]) => (
              <li key={label}><Link to={to} className="hover:text-orange-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm">📧 support@petmart.com</p>
          <p className="text-sm mt-1">📞 +91 98765 43210</p>
          <p className="text-sm mt-1">📍 Chennai, India</p>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} PetMart. All rights reserved.
      </div>
    </footer>
  );
}

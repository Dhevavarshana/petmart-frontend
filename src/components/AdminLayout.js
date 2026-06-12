import { NavLink, Outlet } from 'react-router-dom';
import { FiGrid, FiHeart, FiShoppingBag, FiUsers, FiPackage, FiCalendar, FiBook, FiChevronRight } from 'react-icons/fi';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/pets', icon: FiHeart, label: 'Pets' },
  { to: '/admin/products', icon: FiShoppingBag, label: 'Products' },
  { to: '/admin/orders', icon: FiPackage, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/adoptions', icon: FiHeart, label: 'Adoptions' },
  { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/admin/blogs', icon: FiBook, label: 'Blogs' },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-56 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="px-4 py-5 border-b dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow">
              <svg width="18" height="18" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="58" r="22" fill="white"/>
                <circle cx="28" cy="36" r="11" fill="white"/>
                <circle cx="50" cy="28" r="11" fill="white"/>
                <circle cx="72" cy="36" r="11" fill="white"/>
                <circle cx="82" cy="56" r="9" fill="white"/>
              </svg>
            </div>
            <span className="text-lg font-black tracking-tight">
              <span className="text-orange-500">Pet</span><span className="text-gray-800 dark:text-white">Mart</span>
            </span>
          </div>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 border-r-2 border-orange-500' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`
              }
            >
              <Icon size={16} />
              {label}
              <FiChevronRight size={12} className="ml-auto opacity-40" />
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

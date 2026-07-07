import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Info, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Model Performance', path: '/performance', icon: BarChart2 },
    { name: 'About Project', path: '/about', icon: Info },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-soft fixed left-0 top-0 flex flex-col pt-8 pb-6 px-4 z-10 rounded-r-3xl">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="bg-orangeFarm-500 p-2 rounded-xl">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-gray-900">True<span className="text-orangeFarm-500">Sight</span></h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
              isActive 
                ? "bg-orangeFarm-50 text-orangeFarm-600 shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-100 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
           {/* Placeholder avatar */}
           <span className="text-gray-600 font-bold text-sm">TS</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Admin</p>
          <p className="text-xs text-gray-500">Reviewer Panel</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

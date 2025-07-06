import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Home, Users, BarChart2, Settings, Menu, X, Package, Calendar,
  MessageSquare, Bell, Search, ChevronDown, User, LogOut,
  Moon, Sun, Clipboard, Briefcase
} from 'lucide-react';


export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const [userEmail, setUserEmail] = useState("");
const [userFullname, setUserFullname] = useState("");

useEffect(() => {
  const storedEmail = localStorage.getItem("useremail");
  const storedFullname = localStorage.getItem("userfullname");

  setUserEmail(storedEmail);
  setUserFullname(storedFullname);
}, []);

  const [role, setRole] = useState(null);

    useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    }, []);


  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const allMenuItems = [
    { title: 'Dashboard', icon: <Home className='w-4'/>, path: '/dashboard/AdminDashboard', roles: ['manager']},
    { title: 'Users Management', icon: <Users className='w-4'/>, path: '/dashboard/addUser', roles: ['manager'] },
    { title: 'Project', icon: <BarChart2 className='w-4'/>, path: '/dashboard/GetProject', roles: ['manager'] },
    { title: 'Tasks', icon: <Package className='w-4'/>, path: '/dashboard/getTask', roles: ['manager'] },
    { title: 'Tasks', icon: <Clipboard className='w-4'/>, path: '/dashboard/assignedTask',  roles: ['user'] },
  ];
  
  const menuItems = allMenuItems.filter(item => !item.roles || item.roles.includes(role));
  

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-white text-gray-800">
        {/* Sidebar */}
        <aside className={`transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 text-gray-800`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            {sidebarOpen && <div className="text-xl font-bold text-indigo-600">TaskMaster</div>}
            <button onClick={toggleSidebar}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <nav className="mt-6 space-y-1">
            {menuItems.map(item => (
              <SidebarItem key={item.path} icon={item.icon} title={item.title} badge={item.badge} expanded={sidebarOpen} to={item.path} />
            ))}
          </nav>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="flex justify-between items-center p-4 border-b bg-white border-gray-200">
            <div className="flex items-center space-x-4">
              <h1 className="text-md capitalize text-gray-800">{location.pathname.replace('/', '') || 'dashboard'}</h1>
              <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right hidden md:block">
                <div>{time.toLocaleDateString()}</div>
                <div className="text-xs">{time.toLocaleTimeString()}</div>
              </div>
             
              <div className="relative">
                <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {userFullname
                    ?.split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                  <ChevronDown size={16} />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-md bg-white border border-gray-200">
                   <div className="px-4 py-2 text-sm">
                    <p className="font-medium">{userFullname || "Full Name"}</p>
                    <p className="text-xs text-gray-500">{userEmail || "email@example.com"}</p>
                  </div>

                    {/* <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
                      <User size={16} /> Profile
                    </button> */}
                   
                    <hr className="border-gray-200" />
                    <a href='/login' className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 flex items-center gap-2">
                      <LogOut size={16} /> Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="p-6 overflow-auto flex-1">
            <Outlet />
          </main>
          <footer className="p-4 text-sm text-center border-t bg-white border-gray-200">
            © 2025 TaskMaster. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, title, badge, expanded, to, onClick, isButton = false }) {
  if (isButton) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
      >
        <span>{icon}</span>
        {expanded && <span className="flex-1">{title}</span>}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
          isActive ? 'bg-gray-200' : 'hover:bg-gray-200'
        }`
      }
    >
      <span>{icon}</span>
      {expanded && <span className="flex-1">{title}</span>}
      {badge && expanded && (
        <span className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">{badge}</span>
      )}
    </NavLink>
  );
}

import Link from 'next/link';
import { useRouter } from 'next/router';
import { MessageSquare, Settings, BarChart2, Users } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
  { name: 'Chatbots', href: '/dashboard/chatbots', icon: MessageSquare },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardNav() {
  const router = useRouter();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = router.pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
          >
            <item.icon
              className={`${
                isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
              } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
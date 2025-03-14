import { useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Facebook, MessageCircle, Instagram } from 'lucide-react';

interface PlatformCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected';
  onConnect: () => void;
  onConfigure: () => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  title,
  description,
  icon,
  status,
  onConnect,
  onConfigure,
}) => (
  <Card className="p-6">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'connected'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
          <button
            onClick={status === 'connected' ? onConfigure : onConnect}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            {status === 'connected' ? 'Configure' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  </Card>
);

const SocialMediaDashboard: NextPage = () => {
  const [platforms, setPlatforms] = useState([
    {
      id: 'whatsapp',
      title: 'WhatsApp Business',
      description: 'Connect your WhatsApp Business account to enable chat integration.',
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      status: 'disconnected' as const,
    },
    {
      id: 'facebook',
      title: 'Facebook Messenger',
      description: 'Enable Facebook Messenger integration for your page.',
      icon: <Facebook className="h-6 w-6 text-blue-600" />,
      status: 'disconnected' as const,
    },
    {
      id: 'instagram',
      title: 'Instagram Direct',
      description: 'Connect your Instagram business account for direct messaging.',
      icon: <Instagram className="h-6 w-6 text-pink-600" />,
      status: 'disconnected' as const,
    },
  ]);

  const handleConnect = (platformId: string) => {
    // TODO: Implement platform-specific connection logic
    setPlatforms(platforms.map(p =>
      p.id === platformId ? { ...p, status: 'connected' as const } : p
    ));
  };

  const handleConfigure = (platformId: string) => {
    // TODO: Navigate to platform-specific configuration page
    window.location.href = `/dashboard/social-media/${platformId}/settings`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Social Media Integration</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              title={platform.title}
              description={platform.description}
              icon={platform.icon}
              status={platform.status}
              onConnect={() => handleConnect(platform.id)}
              onConfigure={() => handleConfigure(platform.id)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaDashboard;
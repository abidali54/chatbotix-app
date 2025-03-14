import { useState } from 'react';
import { NextPage } from 'next';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, MessageCircle, Instagram, AlertCircle } from 'lucide-react';

interface PlatformStatus {
  connected: boolean;
  lastSync?: string;
  error?: string;
}

interface SocialMediaPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  status: PlatformStatus;
}

const SocialMediaIntegration: NextPage = () => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const { data: platforms, isLoading } = useQuery('social-platforms', async () => {
    const response = await axios.get('/api/social-platforms');
    return response.data;
  });

  const connectMutation = useMutation(
    async (platformId: string) => {
      const response = await axios.post(`/api/social-platforms/${platformId}/connect`);
      return response.data;
    },
    {
      onSuccess: () => {
        setConnecting(null);
      },
    }
  );

  const disconnectMutation = useMutation(
    async (platformId: string) => {
      const response = await axios.post(`/api/social-platforms/${platformId}/disconnect`);
      return response.data;
    }
  );

  const socialPlatforms: SocialMediaPlatform[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: <MessageCircle className="h-6 w-6" />,
      description: 'Connect your WhatsApp Business account to engage with customers directly.',
      status: platforms?.whatsapp || { connected: false },
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      icon: <Facebook className="h-6 w-6" />,
      description: 'Integrate with Facebook Messenger to chat with your Facebook page visitors.',
      status: platforms?.messenger || { connected: false },
    },
    {
      id: 'instagram',
      name: 'Instagram DM',
      icon: <Instagram className="h-6 w-6" />,
      description: 'Handle Instagram direct messages through your chatbot.',
      status: platforms?.instagram || { connected: false },
    },
  ];

  const handleConnect = (platformId: string) => {
    setConnecting(platformId);
    connectMutation.mutate(platformId);
  };

  const handleDisconnect = (platformId: string) => {
    disconnectMutation.mutate(platformId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Social Media Integration</h1>
        </div>

        <div className="grid gap-6">
          {socialPlatforms.map((platform) => (
            <Card key={platform.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{platform.description}</p>
                    {platform.status.error && (
                      <div className="mt-2 flex items-center text-sm text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {platform.status.error}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant={platform.status.connected ? 'outline' : 'default'}
                  onClick={() =>
                    platform.status.connected
                      ? handleDisconnect(platform.id)
                      : handleConnect(platform.id)
                  }
                  disabled={connecting === platform.id}
                >
                  {connecting === platform.id
                    ? 'Connecting...'
                    : platform.status.connected
                    ? 'Disconnect'
                    : 'Connect'}
                </Button>
              </div>
              {platform.status.connected && platform.status.lastSync && (
                <p className="mt-4 text-sm text-gray-500">
                  Last synchronized: {new Date(platform.status.lastSync).toLocaleString()}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SocialMediaIntegration;
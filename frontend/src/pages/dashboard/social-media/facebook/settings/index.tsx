import { useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Facebook, Bell, Settings, Globe } from 'lucide-react';

interface FacebookSettings {
  pageId: string;
  pageName: string;
  accessToken: string;
  notificationsEnabled: boolean;
  autoReply: boolean;
  autoReplyMessage: string;
  webhookUrl: string;
  greetingMessage: string;
}

const FacebookSettings: NextPage = () => {
  const [settings, setSettings] = useState<FacebookSettings>({
    pageId: '',
    pageName: '',
    accessToken: '',
    notificationsEnabled: true,
    autoReply: false,
    autoReplyMessage: '',
    webhookUrl: '',
    greetingMessage: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Facebook Messenger Settings</h1>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Page Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Page ID
                </label>
                <Input
                  type="text"
                  value={settings.pageId}
                  onChange={(e) => setSettings({ ...settings, pageId: e.target.value })}
                  placeholder="Enter your Facebook Page ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Name
                </label>
                <Input
                  type="text"
                  value={settings.pageName}
                  onChange={(e) => setSettings({ ...settings, pageName: e.target.value })}
                  placeholder="Your Facebook Page Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Access Token
                </label>
                <Input
                  type="password"
                  value={settings.accessToken}
                  onChange={(e) => setSettings({ ...settings, accessToken: e.target.value })}
                  placeholder="Enter your Page Access Token"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <Input
                  type="url"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                  placeholder="https://your-webhook-url.com"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Messenger Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Greeting Message
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  value={settings.greetingMessage}
                  onChange={(e) =>
                    setSettings({ ...settings, greetingMessage: e.target.value })
                  }
                  placeholder="Enter a greeting message for your customers"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Enable Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications for new messages</p>
                </div>
                <Switch
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notificationsEnabled: checked })
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Facebook className="h-5 w-5 mr-2" />
              Auto-Reply Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Enable Auto-Reply</p>
                  <p className="text-sm text-gray-500">Automatically respond to incoming messages</p>
                </div>
                <Switch
                  checked={settings.autoReply}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoReply: checked })
                  }
                />
              </div>
              {settings.autoReply && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto-Reply Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    value={settings.autoReplyMessage}
                    onChange={(e) =>
                      setSettings({ ...settings, autoReplyMessage: e.target.value })
                    }
                    placeholder="Enter your auto-reply message"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacebookSettings;
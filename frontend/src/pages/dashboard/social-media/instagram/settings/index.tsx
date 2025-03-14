import { useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Instagram, Bell, Settings, Globe } from 'lucide-react';

interface InstagramSettings {
  accountId: string;
  username: string;
  accessToken: string;
  notificationsEnabled: boolean;
  autoReply: boolean;
  autoReplyMessage: string;
  webhookUrl: string;
  businessAccount: boolean;
}

const InstagramSettings: NextPage = () => {
  const [settings, setSettings] = useState<InstagramSettings>({
    accountId: '',
    username: '',
    accessToken: '',
    notificationsEnabled: true,
    autoReply: false,
    autoReplyMessage: '',
    webhookUrl: '',
    businessAccount: false,
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
          <h1 className="text-2xl font-bold text-gray-900">Instagram Settings</h1>
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
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Account ID
                </label>
                <Input
                  type="text"
                  value={settings.accountId}
                  onChange={(e) => setSettings({ ...settings, accountId: e.target.value })}
                  placeholder="Enter your Instagram Account ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  type="text"
                  value={settings.username}
                  onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  placeholder="Your Instagram Username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token
                </label>
                <Input
                  type="password"
                  value={settings.accessToken}
                  onChange={(e) => setSettings({ ...settings, accessToken: e.target.value })}
                  placeholder="Enter your Access Token"
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
              Business Features
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Business Account</p>
                  <p className="text-sm text-gray-500">Enable business features and insights</p>
                </div>
                <Switch
                  checked={settings.businessAccount}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, businessAccount: checked })
                  }
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
              <Instagram className="h-5 w-5 mr-2" />
              Auto-Reply Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Enable Auto-Reply</p>
                  <p className="text-sm text-gray-500">Automatically respond to direct messages</p>
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

export default InstagramSettings;
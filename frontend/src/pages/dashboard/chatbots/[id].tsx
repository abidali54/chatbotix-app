import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Settings, Activity } from 'lucide-react';
import { ConversationList } from '@/components/conversations/ConversationList';
import { ChatMetrics } from '@/components/analytics/ChatMetrics';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatbotDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Customer Support Bot</h1>
        </div>

        <Tabs defaultValue="conversations">
          <TabsList>
            <TabsTrigger value="conversations">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversations
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Activity className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ConversationList />
              <ChatInterface />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <ChatMetrics />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="p-6">
              <h3 className="font-medium">Bot Settings</h3>
              {/* Add settings form here */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
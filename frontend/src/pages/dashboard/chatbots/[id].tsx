import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Activity, MessageSquare, Settings } from 'lucide-react';

const ChatbotDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: chatbot, isLoading } = useQuery(
    ['chatbot', id],
    async () => {
      if (!id) return null;
      const response = await axios.get(`/api/chatbot/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!chatbot) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">Chatbot not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{chatbot.name}</h1>
          <button
            onClick={() => router.push(`/dashboard/chatbots/${id}/settings`)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Messages</p>
                <h3 className="text-2xl font-bold">{chatbot.totalMessages || 0}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Response Rate</p>
                <h3 className="text-2xl font-bold">{chatbot.responseRate || '0%'}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg. Response Time</p>
                <h3 className="text-2xl font-bold">{chatbot.avgResponseTime || '0s'}</h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
          <div className="space-y-4">
            {chatbot.recentMessages?.map((message: any) => (
              <div key={message.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded ${message.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {message.type}
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center text-gray-500">No messages yet</div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatbotDetails;
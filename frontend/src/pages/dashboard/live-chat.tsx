import { NextPage } from 'next';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { LiveChat } from '@/components/LiveChat';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Card } from '@/components/ui/card';

const LiveChatPage: NextPage = () => {
  const { data: activeChats, isLoading } = useQuery('active-chats', async () => {
    const response = await axios.get('/api/chats/active');
    return response.data;
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading active chats...</div>
        ) : activeChats?.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            No active chat sessions
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeChats?.map((chat: any) => (
              <LiveChat key={chat.id} chatId={chat.id} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LiveChatPage;
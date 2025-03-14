import { useState } from 'react';
import { NextPage } from 'next';
import { useQuery } from 'react-query';
import axios from 'axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Activity, MessageSquare, Users, BarChart2, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: chatbots, isLoading: chatbotsLoading, error: chatbotsError } = useQuery('chatbots', async () => {
    const response = await axios.get('/api/chatbot');
    return response.data;
  });

  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useQuery('metrics', async () => {
    const response = await axios.get('/api/metrics');
    return response.data;
  }, {
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery('analytics', async () => {
    const response = await axios.get('/api/analytics');
    return response.data;
  }, {
    refetchInterval: 60000, // Refresh every minute
  });

  const displayMetrics = {
    totalChatbots: chatbots?.length || 0,
    activeConversations: metrics?.activeConversations || 0,
    totalUsers: metrics?.totalUsers || 0,
    averageResponseTime: analytics?.averageResponseTime || 0,
    messagesSent: analytics?.messagesSent || 0,
    successRate: analytics?.successRate || 0,
  };

  if (chatbotsError || metricsError) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error loading dashboard data. Please try again later.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'overview'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('chatbots')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'chatbots'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chatbots
            </button>
            <button
              onClick={() => setActiveTab('live-chat')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'live-chat'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Live Chat
            </button>
            <a
              href="/dashboard/social-media"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Social Media
            </a>
            <a
              href="/dashboard/subscription"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Subscription
            </a>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Chatbots</p>
                <h3 className="text-2xl font-bold">{displayMetrics.totalChatbots}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Conversations</p>
                <h3 className="text-2xl font-bold">{displayMetrics.activeConversations}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{displayMetrics.totalUsers}</h3>
              </div>
            </div>
          </Card>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Response Time</p>
                    <h3 className="text-2xl font-bold">{displayMetrics.averageResponseTime}s</h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <BarChart2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Messages Sent</p>
                    <h3 className="text-2xl font-bold">{displayMetrics.messagesSent}</h3>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <h3 className="text-2xl font-bold">{displayMetrics.successRate}%</h3>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conversation Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.conversationTrends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="conversations" stroke="#6366f1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'chatbots' && (
          <div className="mt-6">
            {chatbotsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading chatbots...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {chatbots?.map((chatbot: any) => (
                <Card key={chatbot.id} className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {chatbot.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Platform: {chatbot.platform}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href={`/dashboard/chatbots/${chatbot.id}`}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        View details
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
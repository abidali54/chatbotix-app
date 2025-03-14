import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ChatbotModal from '../../../components/modals/ChatbotModal';

interface Chatbot {
  id: number;
  name: string;
  description: string;
  status: string;
  conversations: number;
  lastActive: string;
}

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);

  const fetchChatbots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chatbots');
      if (!response.ok) throw new Error('Failed to fetch chatbots');
      const data = await response.json();
      setChatbots(data);
    } catch (err) {
      setError('Failed to load chatbots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleCreate = async (data: { name: string; description: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create chatbot');
      await fetchChatbots();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to create chatbot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: { name: string; description: string }) => {
    if (!selectedChatbot) return;
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chatbots/${selectedChatbot.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update chatbot');
      await fetchChatbots();
      setIsModalOpen(false);
      setSelectedChatbot(null);
    } catch (err) {
      setError('Failed to update chatbot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete chatbot');
      setChatbots(chatbots.filter(bot => bot.id !== id));
    } catch (err) {
      setError('Failed to delete chatbot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Chatbots</h1>
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => {
              setSelectedChatbot(null);
              setIsModalOpen(true);
            }}
            disabled={isLoading}
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 inline-block" aria-hidden="true" />
            New Chatbot
          </button>
        </div>

        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Conversations
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Last Active
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {chatbots.map((chatbot) => (
                <tr key={chatbot.id} className={isLoading ? 'opacity-50' : ''}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {chatbot.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{chatbot.description}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                      {chatbot.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{chatbot.conversations}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{chatbot.lastActive}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setSelectedChatbot(chatbot);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={isLoading}
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(chatbot.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ChatbotModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedChatbot(null);
        }}
        onSubmit={selectedChatbot ? handleUpdate : handleCreate}
        initialData={selectedChatbot ? { name: selectedChatbot.name, description: selectedChatbot.description } : undefined}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}
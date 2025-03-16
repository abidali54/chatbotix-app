import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ChatbotsList() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Chatbots</h1>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          New Chatbot
        </Button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Add Chatbot Cards here */}
        <Card className="p-6">
          <h3 className="font-medium">Customer Support Bot</h3>
          <p className="text-sm text-gray-500 mt-1">Handles general inquiries</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
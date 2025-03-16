import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Settings() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      
      <div className="mt-6 space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium">Account Settings</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium">API Settings</h2>
          <div className="mt-4">
            <Button variant="secondary">Generate New API Key</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
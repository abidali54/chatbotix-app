import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const CampaignManager = () => {
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    targetAudience: 'all'
  });

  const { data: campaigns, isLoading } = useQuery('campaigns', async () => {
    const response = await axios.get('/api/email-marketing/campaigns');
    return response.data;
  });

  const { data: analytics } = useQuery('campaignAnalytics', async () => {
    const response = await axios.get('/api/email-marketing/analytics');
    return response.data;
  });

  const createCampaign = useMutation(async (campaignData) => {
    const response = await axios.post('/api/email-marketing/campaigns', campaignData);
    return response.data;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCampaign.mutateAsync(campaign);
    setCampaign({ name: '', subject: '', content: '', targetAudience: 'all' });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Create Campaign</h3>
          <p className="mt-1 text-sm text-gray-600">
            Create a new email marketing campaign to reach your customers.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                  <input
                    type="text"
                    value={campaign.name}
                    onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={campaign.subject}
                    onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={campaign.content}
                    onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                    rows={4}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <select
                    value={campaign.targetAudience}
                    onChange={(e) => setCampaign({ ...campaign, targetAudience: e.target.value })}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="all">All Subscribers</option>
                    <option value="active">Active Customers</option>
                    <option value="inactive">Inactive Customers</option>
                  </select>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {analytics && (
        <div className="mt-8">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Campaign Analytics</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {analytics.map((campaign) => (
              <div key={campaign.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">{campaign.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {((campaign.openCount / campaign.sentCount) * 100).toFixed(1)}% Open Rate
                  </dd>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Sent: {campaign.sentCount}</span>
                      <span>Opened: {campaign.openCount}</span>
                      <span>Clicked: {campaign.clickCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManager;
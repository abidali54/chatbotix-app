import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const ReferralDashboard = () => {
  const [referralLink, setReferralLink] = useState('');

  const { data: referralStats, isLoading } = useQuery('referralStats', async () => {
    const response = await axios.get('/api/referral/stats');
    return response.data;
  });

  const generateReferralLink = async () => {
    try {
      const response = await axios.post('/api/referral/generate-link');
      setReferralLink(response.data.link);
    } catch (error) {
      console.error('Failed to generate referral link:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Referral Program</h3>
          <p className="mt-1 text-sm text-gray-600">
            Invite friends and earn rewards when they make their first purchase.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900">Your Referral Link</h4>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm"
                  >
                    Copy
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generateReferralLink}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Generate New Link
                </button>
              </div>

              {referralStats && (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500">Total Referrals</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {referralStats.totalReferrals}
                      </dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500">Successful Conversions</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {referralStats.successfulConversions}
                      </dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <dt className="text-sm font-medium text-gray-500">Rewards Earned</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        ${referralStats.rewardsEarned}
                      </dd>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
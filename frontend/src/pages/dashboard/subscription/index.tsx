import { NextPage } from 'next';
import { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 3,
    duration: '1 Month',
    features: [
      'Unlimited chatbots',
      'Unlimited messages',
      'Full analytics',
      'Priority support',
      'Custom branding',
      'API access'
    ]
  },
  {
    id: 'semi-annual',
    name: '6 Months Plan',
    price: 10,
    duration: '6 Months',
    features: [
      'Unlimited chatbots',
      'Unlimited messages',
      'Full analytics',
      'Priority support',
      'Custom branding',
      'API access'
    ]
  },
  {
    id: 'annual',
    name: 'Annual Plan',
    price: 15,
    duration: '1 Year',
    features: [
      'Unlimited chatbots',
      'Unlimited messages',
      'Full analytics',
      'Priority support',
      'Custom branding',
      'API access'
    ]
  }
];

const SubscriptionPage: NextPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: currentSubscription, isLoading } = useQuery('subscription', async () => {
    const response = await axios.get('/api/subscription');
    return response.data;
  });

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await axios.post('/api/subscription/checkout', {
        planId
      });
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="ml-2 text-gray-500">/{plan.duration.toLowerCase()}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan.id);
                  }}
                  className="w-full"
                  disabled={isLoading}
                >
                  {currentSubscription?.planId === plan.id ? 'Current Plan' : 'Subscribe'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading subscription details...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
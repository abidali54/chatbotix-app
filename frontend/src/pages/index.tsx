import SEO from '../components/SEO';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChatBubbleBottomCenterTextIcon, CubeIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

type FormData = {
  email: string;
  name: string;
  company: string;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" role="main">
      <SEO
        title="Chatbotix - AI-Powered Customer Service Platform"
        description="Enhance your customer service with our AI-powered chatbot platform. Streamline support, increase engagement, and boost sales with intelligent automation."
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center" role="region" aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Transform Your Customer Service</span>
              <span className="block text-indigo-600">With AI-Powered Chatbots</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Streamline your customer support, increase engagement, and boost sales with our intelligent chatbot platform.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:flex-col sm:items-center md:mt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4" aria-label="Get started form">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    {...register('company', { required: 'Company name is required' })}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${errors.company ? 'border-red-500' : ''}`}
                  />
                  {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    aria-label={isLoading ? "Submitting form..." : "Get Started"}
                  >
                    {isLoading ? <LoadingSpinner size="small" color="text-white" /> : 'Get Started'}
                  </button>
                </div>
                {submitError && <p className="text-sm text-red-600 text-center">{submitError}</p>}
                {submitSuccess && <p className="text-sm text-green-600 text-center">Thank you for your interest! We'll be in touch soon.</p>}
              </form>
              <div className="mt-3 rounded-md shadow sm:mt-4">
                <a href="/demo" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to excel in customer service
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" role="region" aria-labelledby="hero-heading">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Pricing</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Choose the perfect plan for your business
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Start with our free trial and upgrade anytime to access premium features
            </p>
          </div>

          <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {/* Basic Plan */}
            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">$29</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">Perfect for small businesses getting started with AI chatbots.</p>

                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">1,000 messages/month</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Basic AI responses</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Email support</span>
                  </li>
                </ul>
              </div>
              <a href="/signup" className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-indigo-700">Get started</a>
            </div>

            {/* Pro Plan */}
            <div className="relative p-8 bg-white border border-indigo-200 rounded-2xl shadow-sm flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex px-4 py-1 border border-indigo-600 rounded-full text-sm font-semibold tracking-wide text-indigo-600 bg-white">
                Most Popular
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Pro</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">$79</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">Advanced features for growing businesses.</p>

                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">10,000 messages/month</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Advanced AI capabilities</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Priority support</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Custom integrations</span>
                  </li>
                </ul>
              </div>
              <a href="/signup" className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-indigo-700">Get started</a>
            </div>

            {/* Enterprise Plan */}
            <div className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-5xl font-extrabold tracking-tight">$299</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
                <p className="mt-6 text-gray-500">Custom solutions for large organizations.</p>

                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Unlimited messages</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Custom AI model training</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">24/7 dedicated support</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500">Advanced analytics & reporting</span>
                  </li>
                </ul>
              </div>
              <a href="/contact" className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-3 px-6 text-center font-medium text-white hover:bg-indigo-700">Contact sales</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'AI-Powered Conversations',
    description: 'Our advanced AI understands context and provides human-like responses to your customers.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: 'Easy Integration',
    description: 'Seamlessly integrate with your existing platforms and start engaging with customers in minutes.',
    icon: CubeIcon,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Get detailed insights into customer interactions and optimize your chatbot performance.',
    icon: ChartBarIcon,
  },
];
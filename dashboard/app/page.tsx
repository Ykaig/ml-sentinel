// dashboard/app/page.tsx

// This directive tells Next.js to render this component on the client-side
"use client";

import { useState, useEffect } from 'react';

// Define a type for our model data
type DeployedModel = {
  name: string;
  status: 'Checking...' | 'Operational' | 'Offline'; // Added 'Checking...' state
  url: string;
  lastChecked: string;
};

const TOXIC_COMMENT_API_URL = process.env.NEXT_PUBLIC_TOXIC_COMMENT_API_URL;

// Initial state of our models. We only have one real model for now.
const initialModels: DeployedModel[] = [
  {
    name: 'toxic-comment-classifier',
    status: 'Checking...', // Start with a 'Checking...' status
    url: TOXIC_COMMENT_API_URL || '#',
    lastChecked: 'N/A',
  },
  // You can add more models here as you deploy them
];

// A simple component to render a status badge with appropriate colors
const StatusBadge = ({ status }: { status: DeployedModel['status'] }) => {
  const colorClasses = {
    'Operational': 'bg-green-100 text-green-800',
    'Offline': 'bg-red-100 text-red-800',
    'Checking...': 'bg-blue-100 text-blue-800',
  };
  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}
    >
      {status}
    </span>
  );
};

export default function Home() {
  // Create a state variable to hold the list of models
  const [models, setModels] = useState<DeployedModel[]>(initialModels);

  // useEffect hook to run the health check when the component mounts
  useEffect(() => {
    // An async function to perform the health checks
    const performHealthChecks = async () => {

      console.log("API URL from environment variable:", TOXIC_COMMENT_API_URL);

      // Create a new array of promises, one for each model's health check
      const healthCheckPromises = initialModels.map(async (model) => {

        console.log(`Checking health for ${model.name} at URL: ${model.url}`);

        // We only check models with a real URL
        //if (model.url.startsWith('https://')) {
        try {
          // Fetch the root endpoint of the deployed API.

          const response = await fetch(model.url, { signal: AbortSignal.timeout(5000) });

          // the service is operational - ok (status 200-299)
          if (response.ok) {
            return { ...model, status: 'Operational' as const, lastChecked: new Date().toLocaleString() };
          }
        } catch (error) {
          console.error(`Health check failed for ${model.name}:`, error);
          // If fetch fails (e.g., timeout, network error), mark as offline
          return { ...model, status: 'Offline' as const, lastChecked: new Date().toLocaleString() };
        }
        // }
        // If the check fails for any reason, return the model with an 'Offline' status
        return { ...model, status: 'Offline' as const, lastChecked: new Date().toLocaleString() };
      });

      // Wait for all health checks to complete
      const updatedModels = await Promise.all(healthCheckPromises);

      // Update the state with the new statuses, triggering a re-render
      setModels(updatedModels);
    };

    performHealthChecks();
  }, []); // The empty dependency array [] means this effect runs only once

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-sm">
        {/* ... Header content remains the same ... */}
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            ML Sentinel Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Live status of all deployed machine learning models.
          </p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul role="list" className="divide-y divide-gray-200">
                {models.map((model) => (
                  <li key={model.name}>
                    <a href={model.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-md font-medium text-indigo-600 truncate">
                            {model.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <StatusBadge status={model.status} />
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a2 2 0 112.828-2.828l1.5 1.5a.5.5 0 00.707 0l3-3a.5.5 0 00-.707-.707l-3 3a1 1 0 01-1.414 0l-1.5-1.5a1 1 0 10-1.414 1.414l1.5 1.5a3 3 0 004.242 0l3-3a3 3 0 00-4.242-4.242l-3 3a.5.5 0 00.707.707l3-3z" clipRule="evenodd" />
                              </svg>
                              {model.url}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Last checked: {model.lastChecked}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
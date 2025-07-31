'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to your logging service
        console.error('Application Error:', error);
    }, [error]);

    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                <h1 className="text-9xl font-bold text-red-500 mb-4">Oops!</h1>
                <h2 className="text-4xl font-semibold text-white mb-8">Something went wrong</h2>
                <p className="text-gray-300 mb-8 text-lg">
                    Sorry, an error occurred while processing your request.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
} 
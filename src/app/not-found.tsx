'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                <h2 className="text-4xl font-semibold text-white mb-8">Page Not Found</h2>
                <p className="text-gray-300 mb-8 text-lg">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
} 
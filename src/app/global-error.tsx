'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log critical error to console
        console.error("Critical Global Error:", error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
                    <div className="text-center max-w-md">
                        <h1 className="text-5xl font-bold text-destructive mb-4">System Error</h1>
                        <h2 className="text-2xl font-semibold mb-4">A Critical Error Occurred</h2>
                        <p className="text-gray-500 mb-8">
                            The system is experiencing technical difficulties. Please try again later or contact support if the problem persists.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => reset()}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                Try Again
                            </Button>
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/">
                                    Back to Home
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
} 
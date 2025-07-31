import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-medium text-foreground">Loading...</h2>
                <p className="text-sm text-muted-foreground">Please wait a moment</p>
            </div>
        </div>
    );
} 
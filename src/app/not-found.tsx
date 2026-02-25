import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-md w-full text-center space-y-8 glass p-10 rounded-3xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-primary" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl rounded-full" />

                <div className="relative z-10">
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-2">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Oops! The page you're looking for seems to have wandered off the field. Let's get you back in the game.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Back to Home
                        </Link>

                        <Link
                            href="/collections"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-border text-base font-medium rounded-full text-foreground bg-background hover:bg-secondary transition-all duration-200"
                        >
                            Shop Collections
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

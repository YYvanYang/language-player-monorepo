// apps/user-app/app/page.tsx (Assuming this is the PUBLIC landing page, not the logged-in dashboard)
import Image from "next/image";
import Link from "next/link";
import { Button } from "@repo/ui"; // Use shared UI

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
        {/* Simple Landing Page Header */}
        <header className="p-4 border-b dark:border-slate-700">
             <div className="container mx-auto flex justify-between items-center">
                 <span className="font-bold text-xl">AudioLang Player</span>
                 <div className="space-x-2">
                     <Button variant="ghost" asChild size="sm"><Link href="/login">Login</Link></Button>
                     <Button variant="default" asChild size="sm"><Link href="/register">Register</Link></Button>
                 </div>
             </div>
        </header>

      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Languages with Audio</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
              Immerse yourself in authentic audio content, track your progress, and reach fluency faster.
          </p>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
               <Button size="lg" asChild>
                   <Link href="/register">Get Started Free</Link>
               </Button>
               <Button variant="outline" size="lg" asChild>
                   <Link href="/tracks">Explore Tracks</Link>
               </Button>
          </div>

          {/* Placeholder for features section */}
          {/* <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>Feature 1</div>
              <div>Feature 2</div>
              <div>Feature 3</div>
          </div> */}

      </main>

      {/* Simple Landing Page Footer */}
       <footer className="p-4 border-t dark:border-slate-700 text-center text-xs text-slate-500">
           © {new Date().getFullYear()} YourAppName.
       </footer>
    </div>
  );
}
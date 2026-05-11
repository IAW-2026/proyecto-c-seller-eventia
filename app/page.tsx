import { arizonia } from '@/app/ui/fonts';
import { auth } from "@clerk/nextjs/server"; 
import { redirect } from 'next/navigation';

export default async function YourComponent() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-white px-8 py-8">
      <div className="flex flex-col items-start gap-8">
        <h1 className={`text-5xl md:text-6xl font-bold text-slate-900 ${arizonia.className}`}>
          eventia
        </h1>
        {/* rest of your content */}
      </div>
    </div>
  );
}
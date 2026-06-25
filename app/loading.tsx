import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <Image
        src="/logo.png"
        alt="Eventia"
        width={52}
        height={52}
        className="rounded-full animate-pulse"
      />
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e8ddd5] border-t-[#7b0b0b]" />
    </div>
  );
}

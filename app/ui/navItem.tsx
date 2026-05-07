import Link from 'next/link';

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  active?: boolean;
};

export default function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
}
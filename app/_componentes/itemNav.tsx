'use client';

import Link from 'next/link';

interface ItemNavProps {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}

// Link de navegación lateral con estado activo para los sidebars
export default function ItemNav({ href, label, icon: Icon, active }: ItemNavProps) {
  return (
    <Link
      href={href}
      className={`mx-2 flex items-center gap-2.5 border-l-[3px] px-4 py-2 text-[13px] transition-colors ${
        active
          ? 'border-l-[var(--color-primary-vivid)] bg-[#f5e8e4] font-medium text-[var(--color-primary-vivid)]'
          : 'border-l-transparent text-[#5a3a35] hover:bg-[#faf0ee]'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

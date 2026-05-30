import { Arizonia, Climate_Crisis, Bricolage_Grotesque, Manrope, PT_Serif } from 'next/font/google';

export const ffDisplay = Climate_Crisis({
  subsets: ['latin'],
  variable: '--ff-display',
});

export const ffBody = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--ff-body',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const ffLabel = Manrope({
  subsets: ['latin'],
  variable: '--ff-label',
  weight: ['400', '500', '600', '700', '800'],
});

export const arizonia = Arizonia({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

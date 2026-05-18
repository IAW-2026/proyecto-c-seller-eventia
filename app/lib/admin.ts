import { auth } from '@clerk/nextjs/server';

export async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  if (userId === process.env.ADMIN_USER_ID) {
    return true;
  }

  return false;
}

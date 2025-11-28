import { redirect } from 'next/navigation';

// This is the user ID for the default portfolio that will be shown on the homepage.
// You can change this to any user ID from your Firestore `users` collection.
const DEFAULT_PORTFOLIO_USER_ID = "UmsuxfmYVFgcVeaDwGJ7NvKoF662";

export default function Home() {
  // Redirect the root path to the default user's portfolio page.
  redirect(`/${DEFAULT_PORTFOLIO_USER_ID}`);
}

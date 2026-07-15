import { auth } from "@/lib/auth";
import { LandingContent } from "@/components/landing/landing-content";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <LandingContent isLoggedIn={isLoggedIn} />
  );
}

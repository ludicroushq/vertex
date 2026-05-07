import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import posthog from "posthog-js";
import { useEffect } from "react";
import { clientEnv } from "@/lib/config/client";

export function PostHogIdentity() {
  const { loading, organizationId, user } = useAuth();
  const email = user?.email;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const userId = user?.id;

  useEffect(() => {
    if (!clientEnv.VITE_POSTHOG_KEY) {
      return;
    }

    if (loading) {
      return;
    }

    if (!userId) {
      posthog.reset();
      return;
    }

    posthog.identify(userId, {
      email,
      name: [firstName, lastName].filter(Boolean).join(" "),
      organizationId,
    });
  }, [email, firstName, lastName, loading, organizationId, userId]);

  return null;
}

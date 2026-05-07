import { useAuth } from "@workos/authkit-tanstack-react-start/client";
import { useEffect } from "react";
import { Analytics } from "./client";

export function PostHogIdentity() {
  const { loading, organizationId, user } = useAuth();
  const email = user?.email;
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const userId = user?.id;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!userId) {
      Analytics.reset();
      return;
    }

    Analytics.identify({
      distinctId: userId,
      properties: {
        email,
        name: [firstName, lastName].filter(Boolean).join(" "),
        organizationId,
      },
    });
  }, [email, firstName, lastName, loading, organizationId, user, userId]);

  return null;
}

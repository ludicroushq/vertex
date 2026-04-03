import type { AuthConfig } from "convex/server";

const clientId = process.env.WORKOS_CLIENT_ID; // eslint-disable-line n/prefer-global/process

if (!clientId) {
  throw new Error("WORKOS_CLIENT_ID is required");
}

export default {
  providers: [
    {
      algorithm: "RS256",
      applicationID: clientId,
      issuer: "https://api.workos.com/",
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
      type: "customJwt",
    },
    {
      algorithm: "RS256",
      issuer: `https://api.workos.com/user_management/${clientId}`,
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
      type: "customJwt",
    },
  ],
} satisfies AuthConfig;

export function getSafeReturnPathname(request: Request) {
  const returnPathname = new URL(request.url).searchParams.get(
    "returnPathname",
  );

  if (
    !returnPathname ||
    !returnPathname.startsWith("/") ||
    returnPathname.startsWith("//")
  ) {
    return;
  }

  return returnPathname;
}

export function redirectResponse(location: string) {
  return new Response(null, {
    headers: {
      Location: location,
    },
    status: 307,
  });
}

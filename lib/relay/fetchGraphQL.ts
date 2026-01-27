import { env } from "@/lib/env";
import { RequestParameters, Variables } from "relay-runtime";

export const fetchQuery = async (
  params: RequestParameters,
  variables: Variables,
) => {
  const response = await fetch(env.NEXT_PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${token}`, // If needed in future
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  return await response.json();
};

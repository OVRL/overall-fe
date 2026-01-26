import { RequestParameters, Variables } from "relay-runtime";

const ENDPOINT = "http://api.ovr-log.com/graphql";

export const fetchQuery = async (
  params: RequestParameters,
  variables: Variables,
) => {
  const response = await fetch(ENDPOINT, {
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

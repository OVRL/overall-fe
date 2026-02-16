import { env } from "@/lib/env";
import {
  CacheConfig,
  RequestParameters,
  UploadableMap,
  Variables,
} from "relay-runtime";

export const fetchQuery = async (
  params: RequestParameters,
  variables: Variables,
  _cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
) => {
  const request: RequestInit = {
    method: "POST",
  };

  if (uploadables) {
    const formData = new FormData();
    const operations = {
      query: params.text,
      variables: { ...variables },
    };

    const map: Record<string, string[]> = {};
    let i = 0;

    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(operations.variables, key)) {
        operations.variables[key] = null;
      }
      map[`${i}`] = [`variables.${key}`];
      i++;
    });

    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify(map));

    i = 0;
    Object.keys(uploadables).forEach((key) => {
      formData.append(`${i}`, uploadables[key]);
      i++;
    });

    request.body = formData;
  } else {
    request.headers = {
      "Content-Type": "application/json",
    };
    request.body = JSON.stringify({
      query: params.text,
      variables,
    });
  }

  const response = await fetch(
    `${env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
    request,
  );

  return await response.json();
};

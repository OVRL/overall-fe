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

  // 같은 오리진의 API 라우트로 보내 쿠키가 전달되고, 서버에서 Authorization 헤더가 붙습니다.
  const response = await fetch("/api/graphql", {
    ...request,
    credentials: "include",
  });

  return await response.json();
};

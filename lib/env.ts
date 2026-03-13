import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.string().url(),
    /** 개발 시 쿠키 대신 사용할 accessToken (실섭에서 복사해 .env.local에 설정). 프로덕션에서는 사용하지 않음. */
    DEV_ACCESS_TOKEN: z.string().optional(),
    /** 개발 시 refreshToken fallback (선택). DEV_ACCESS_TOKEN 만으로도 대부분 동작. */
    DEV_REFRESH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_BACKEND_URL: z.string().url(),
    NEXT_PUBLIC_NAVER_CLIENT_ID: z.string(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_NAVER_CLIENT_ID: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
    DEV_ACCESS_TOKEN: process.env.DEV_ACCESS_TOKEN,
    DEV_REFRESH_TOKEN: process.env.DEV_REFRESH_TOKEN,
  },
});

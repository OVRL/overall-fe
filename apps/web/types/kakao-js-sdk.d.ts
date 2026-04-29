/**
 * Kakao JavaScript SDK용 전역 타입 (로그인·공유 등 한 객체에 Auth·Share 병합)
 */
export {};

declare global {
  interface KakaoFeedOptions {
    objectType: "feed";
    content: {
      title: string;
      description?: string;
      imageUrl?: string;
      link: { mobileWebUrl: string; webUrl: string };
    };
    buttons?: {
      title: string;
      link: { mobileWebUrl: string; webUrl: string };
    }[];
  }

  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Auth: {
        authorize: (options?: {
          redirectUri?: string;
          state?: string;
        }) => void;
      };
      Share: {
        sendDefault: (options: KakaoFeedOptions) => void;
        uploadImage: (options: {
          file: File[];
        }) => Promise<{ infos: { original: { url: string } } }>;
      };
    };
  }
}

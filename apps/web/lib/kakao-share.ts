declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: KakaoFeedOptions) => void;
        uploadImage: (options: { file: File[] }) => Promise<{ infos: { original: { url: string } } }>;
      };
    };
  }
}

interface KakaoFeedOptions {
  objectType: "feed";
  content: {
    title: string;
    description?: string;
    imageUrl?: string;
    link: { mobileWebUrl: string; webUrl: string };
  };
  buttons?: { title: string; link: { mobileWebUrl: string; webUrl: string } }[];
}

function isKakaoReady() {
  return typeof window !== "undefined" && !!window.Kakao?.Share;
}

/** 피드 메시지 공유 (이미지 URL 또는 링크만) */
export function kakaoShareFeed(options: KakaoFeedOptions) {
  if (!isKakaoReady()) return false;
  window.Kakao!.Share.sendDefault(options);
  return true;
}

/** 이미지 blob → Kakao CDN 업로드 후 URL 반환 */
export async function kakaoUploadImage(blob: Blob): Promise<string | null> {
  if (!isKakaoReady()) return null;
  try {
    const file = new File([blob], "share.png", { type: "image/png" });
    const result = await window.Kakao!.Share.uploadImage({ file: [file] });
    return result.infos.original.url;
  } catch {
    return null;
  }
}

/** 포메이션 페이지 공유 */
export async function shareFormation(options: {
  matchTitle: string;
  matchUrl: string;
  imageBlob?: Blob | null;
}) {
  const url = options.matchUrl;
  let imageUrl: string | undefined;

  if (options.imageBlob) {
    const uploaded = await kakaoUploadImage(options.imageBlob);
    imageUrl = uploaded ?? undefined;
  }

  const shared = kakaoShareFeed({
    objectType: "feed",
    content: {
      title: options.matchTitle,
      description: "오버롤에서 포메이션을 확인하세요",
      imageUrl,
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [{ title: "포메이션 보기", link: { mobileWebUrl: url, webUrl: url } }],
  });

  if (!shared) {
    // Kakao SDK 미로드 시 Web 공유 fallback
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}`,
      "_blank",
    );
  }
}

/** 선수 기록 페이지 공유 */
export function sharePlayerHistory(options: {
  playerName: string;
  historyUrl: string;
  imageUrl?: string;
}) {
  const url = options.historyUrl;

  const shared = kakaoShareFeed({
    objectType: "feed",
    content: {
      title: `${options.playerName}의 HISTORY`,
      description: "오버롤 시즌 기록을 확인하세요",
      imageUrl: options.imageUrl,
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [{ title: "기록 보기", link: { mobileWebUrl: url, webUrl: url } }],
  });

  if (!shared) {
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}`,
      "_blank",
    );
  }
}

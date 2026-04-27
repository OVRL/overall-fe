import type { Metadata } from "next";
import InvitePageClient from "./_components/InvitePageClient";

const INVITE_MESSAGES = [
  {
    title: "⚽ 팀 입단 초대가 도착했어요!",
    description: "당신의 오버롤을 보여주세요. 지금 팀에 합류하고 함께 뛰어요!",
  },
  {
    title: "🏆 같이 뛸 팀원을 찾고 있어요",
    description: "실력을 마음껏 펼칠 수 있는 팀이 기다리고 있어요. 지금 바로 확인해 보세요.",
  },
  {
    title: "🔥 드디어 당신의 차례예요!",
    description: "팀원들이 당신을 기다리고 있어요. 지금 바로 합류하세요.",
  },
  {
    title: "⚡ 당신의 포지션이 비어있어요",
    description: "팀이 당신의 실력을 필요로 합니다. 지금 입단 신청하세요!",
  },
  {
    title: "🎯 오버롤이 높은 팀을 만났어요",
    description: "같이 공 차실 분을 모십니다. 링크를 눌러 바로 팀 정보를 확인하세요.",
  },
];

function pickMessage(code: string) {
  const idx =
    code.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    INVITE_MESSAGES.length;
  return INVITE_MESSAGES[idx];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const { title, description } = pickMessage(code);
  const imageUrl = `https://ovr-log.com/invite/${code}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ovr-log.com/invite/${code}`,
      siteName: "Overall",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <InvitePageClient code={code} />;
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Overall 팀 초대";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MESSAGES = [
  "당신의 오버롤을 보여주세요!",
  "같이 공 찰 팀원을 찾고 있어요",
  "드디어 당신의 차례예요!",
  "당신의 포지션이 비어있어요",
  "오버롤이 높은 팀을 만났어요",
];

export default async function OGImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const idx =
    code.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    MESSAGES.length;
  const message = MESSAGES[idx];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 그라데이션 원 */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(184,255,18,0.15) 0%, transparent 70%)",
            top: -100,
            left: -100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(184,255,18,0.08) 0%, transparent 70%)",
            bottom: -50,
            right: 100,
          }}
        />

        {/* 로고 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#b8ff12",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 900, color: "#000" }}>⚽</span>
          </div>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#b8ff12", letterSpacing: "-1px" }}>
            OVERALL
          </span>
        </div>

        {/* 메인 텍스트 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          팀 입단 초대
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#a6a5a5",
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          {message}
        </div>

        {/* 초대 코드 배지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "rgba(184,255,18,0.1)",
            border: "1px solid rgba(184,255,18,0.3)",
            borderRadius: 16,
            padding: "12px 28px",
          }}
        >
          <span style={{ fontSize: 14, color: "#b8ff12", letterSpacing: "0.1em" }}>
            초대 코드
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#b8ff12", letterSpacing: "0.15em" }}>
            {code}
          </span>
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            color: "#555",
          }}
        >
          ovr-log.com
        </div>
      </div>
    ),
    { ...size },
  );
}

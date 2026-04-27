import Footer from "@/components/ui/Footer";
import MarketingNoticeBackButton from "./_components/MarketingNoticeBackButton";

/**
 * 마케팅 정보 수신 동의 안내 전문.
 * Confluence 게시본과 동기화한 뒤, 플레이스홀더([ ])만 법무·운영에서 치환해 주세요.
 */
export default function MarketingNoticePage() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-black text-Label-Primary pt-safe">
      <main className="box-border mx-auto w-full max-w-layout flex-1 px-4 py-6 md:py-10 xl:max-w-[1336px]">
        <div className="mb-8">
          <MarketingNoticeBackButton />
        </div>
        <article className="w-full rounded-2xl border border-[#252525] bg-[#151515] p-6 md:p-12 space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold text-white leading-9">
              마케팅 정보 수신 동의
            </h1>
            <p className="text-sm text-[#888] leading-relaxed">
              시행일: [서비스 런칭 일자]
            </p>
          </header>

          <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6">
            <p className="text-[#A6A5A5] leading-relaxed">
              본 동의는 선택 사항입니다. 동의하지 않아도 기본 서비스 이용에
              제한이 없습니다.
            </p>
          </div>

          <div className="rounded-[0.875rem] border border-[#B8FF12]/30 p-6 space-y-3">
            <p className="text-[#A6A5A5] leading-relaxed">
              만 14세 미만 이용자에게는 마케팅 수신 동의를 요청하지 않으며,
              광고성 메시지를 발송하지 않습니다.
            </p>
          </div>

          <p className="text-[#A6A5A5] leading-relaxed">
            오버롤(이하 &quot;서비스&quot;)은 이용자에게 유용한 정보와 혜택을
            제공하기 위해 아래와 같이 마케팅 정보 수신에 대한 동의를 받고자
            합니다.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              1. 수집 및 이용 목적 (광고성 정보 발송)
            </h2>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>
                서비스 내 새로운 기능 안내 (포메이션 업데이트, MOM 신규 기능
                등)
              </li>
              <li>이벤트, 프로모션 및 혜택 정보 제공</li>
              <li>
                팀 활동 관련 맞춤형 메시지 (경기 참석 독려, 기록 달성 축하 등)
              </li>
              <li>오버롤 관련 뉴스 및 업데이트 소식</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              2. 수집 항목
            </h2>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>카카오 계정 정보 (카카오 친구톡 발송 대상 식별 목적)</li>
              <li>앱 푸시 알림 수신 동의 여부</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              3. 광고성 메시지 발송 채널
            </h2>
            <h3 className="text-base font-semibold text-white">
              ① 카카오 친구톡 (주요 채널)
            </h3>
            <p className="text-[#A6A5A5] leading-relaxed">
              마케팅 수신 동의를 한 이용자에게 카카오(주)의 친구톡 서비스를
              통해 광고성 메시지를 발송합니다.
            </p>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6">
              <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
                <li>발송 주체: 오버롤 서비스</li>
                <li>발송 채널: 카카오 친구톡</li>
                <li>수신 조건: 오버롤 카카오 채널 추가 + 마케팅 수신 동의</li>
              </ul>
            </div>
            <h3 className="text-base font-semibold text-white pt-2">
              ② 앱 푸시 알림
            </h3>
            <p className="text-[#A6A5A5] leading-relaxed">
              앱 푸시 알림을 통해 이벤트·혜택 관련 광고성 알림을 발송합니다. 기기
              알림 설정이 켜진 경우에만 수신됩니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed text-sm border-l-2 border-[#252525] pl-4">
              카카오 알림톡(서비스 알림: 경기 일정, 참석 투표, MOM 결과 등)은
              서비스 운영에 필수적인 정보로, 마케팅 수신 동의와 무관하게
              발송됩니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              4. 보유 및 이용 기간
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              마케팅 수신 동의 철회 시까지 보유·이용합니다. 동의 철회 후에는
              광고성 메시지 발송이 즉시 중단됩니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              5. 수신 동의 거부 및 철회
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              동의 후 언제든지 아래의 방법으로 철회할 수 있습니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>앱 내 [설정 &gt; 알림 설정 &gt; 마케팅 수신 동의 해제]</li>
              <li>수신한 카카오 친구톡 메시지 내 &quot;수신거부&quot; 링크 클릭</li>
              <li>카카오톡 채널 차단 또는 채널 친구 삭제</li>
              <li>
                고객센터 문의:{" "}
                <span className="text-Label-AccentPrimary">[이메일 주소]</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              6. 정보통신망법 제50조에 따른 고지
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              서비스는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」
              제50조에 따라 광고성 정보 전송 시 아래 사항을 준수합니다.
            </p>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6">
              <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
                <li>광고성 정보임을 명확히 표시합니다.</li>
                <li>
                  야간(오후 9시 ~ 다음날 오전 8시)에는 별도의 명시적 동의 없이
                  광고성 메시지를 발송하지 않습니다.
                </li>
                <li>수신 거부 방법을 메시지 내에 명시합니다.</li>
              </ul>
            </div>
          </section>

          <footer className="pt-8 space-y-1 text-sm leading-5 text-[#666] border-t border-[#252525]">
            <p>공고일자: [서비스 런칭 일자]</p>
            <p>시행일자: [서비스 런칭 일자]</p>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}

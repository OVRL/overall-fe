"use client";

import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh bg-black text-Label-Primary pt-safe">
      <main className="px-4 py-6 md:py-10 md:max-w-layout md:mx-auto w-full">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors group"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            뒤로가기
          </button>
        </div>

        <article className="rounded-[1.25rem] border border-border-card bg-surface-card p-5 md:p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">이용약관</h1>
            <p className="text-xs text-Label-Tertiary">시행일: 2026년 1월 1일</p>
          </div>

          {/* 제1조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제1조 (목적)
            </h2>
            <p className="text-sm text-Label-Tertiary leading-relaxed">
              이 약관은 오버롤(이하 &quot;회사&quot;)이 운영하는 축구팀 관리 플랫폼 &quot;오버롤(Overall)&quot; 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제2조 (정의)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2">
                <li>&quot;서비스&quot;란 회사가 제공하는 축구팀 관리 플랫폼 및 관련 제반 서비스를 의미합니다.</li>
                <li>&quot;이용자&quot;란 이 약관에 동의하고 서비스를 이용하는 모든 자를 말합니다.</li>
                <li>&quot;회원&quot;이란 서비스에 회원가입하여 아이디(ID)를 부여받은 이용자를 말합니다.</li>
                <li>&quot;팀&quot;이란 회원이 서비스 내에서 생성하거나 가입한 축구팀 단위를 말합니다.</li>
                <li>&quot;콘텐츠&quot;란 회원이 서비스 내에서 게시한 텍스트, 이미지, 데이터 등 일체의 정보를 말합니다.</li>
              </ol>
            </div>
          </section>

          {/* 제3조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제3조 (약관의 효력 및 변경)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</p>
              <p>② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.</p>
              <p>③ 약관이 변경되는 경우 회사는 변경 사유 및 적용일자를 명시하여 현행 약관과 함께 서비스 내 공지사항에 30일 이상 게시합니다.</p>
              <p>④ 회원이 변경된 약관의 적용일자 이후에도 계속하여 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 봅니다.</p>
            </div>
          </section>

          {/* 제4조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제4조 (서비스 이용계약의 성립)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 이용계약은 이용자가 약관의 내용에 동의한 후 회원가입을 완료함으로써 성립됩니다.</p>
              <p>② 회사는 소셜 로그인(카카오, 구글, 네이버 등) 방식을 통한 회원가입을 지원하며, 해당 제3자 서비스의 이용약관이 추가로 적용될 수 있습니다.</p>
              <p>③ 회사는 다음 각 호에 해당하는 경우 이용계약의 성립을 유보하거나 거절할 수 있습니다.
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-2">
                <li>타인의 명의를 사용하여 신청한 경우</li>
                <li>허위 정보를 기재한 경우</li>
                <li>관련 법령에 위반되거나 사회의 안녕질서 또는 미풍양속을 해할 우려가 있는 경우</li>
              </ol>
            </div>
          </section>

          {/* 제5조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제5조 (서비스의 제공 및 변경)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 회사는 다음과 같은 서비스를 제공합니다.</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2">
                <li>축구팀 생성 및 관리 서비스</li>
                <li>팀 선수 등록 및 포지션 관리 서비스</li>
                <li>경기 일정 및 결과 기록 서비스</li>
                <li>팀 통계 및 분석 서비스</li>
                <li>베스트 일레븐(Best 11) 구성 서비스</li>
                <li>맨 오브 더 매치(MOM) 투표 서비스</li>
                <li>기타 회사가 개발 또는 제휴를 통해 이용자에게 제공하는 서비스</li>
              </ol>
              <p>② 회사는 기술적·운영적 필요에 의해 제공 중인 서비스의 일부 또는 전부를 변경할 수 있으며, 변경 시 사전에 공지합니다.</p>
            </div>
          </section>

          {/* 제6조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제6조 (서비스 이용 제한)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 이용자는 다음 각 호의 행위를 해서는 안 됩니다.</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2">
                <li>타인의 개인정보를 도용하거나 허위 정보를 등록하는 행위</li>
                <li>서비스 운영을 고의로 방해하거나 불안정하게 만드는 행위</li>
                <li>저작권 등 지식재산권을 침해하는 콘텐츠를 게시하는 행위</li>
                <li>타인에 대한 명예훼손, 모욕, 개인정보 침해 등의 행위</li>
                <li>음란물, 폭력적 콘텐츠 등 공序良俗(공서양속)에 반하는 콘텐츠를 게시하는 행위</li>
                <li>서비스를 이용하여 영리 목적의 광고, 홍보 등 상업적 활동을 하는 행위</li>
                <li>자동화된 수단(봇, 스크레이퍼 등)을 통해 서비스에 접근하는 행위</li>
                <li>관련 법령에 위반되는 일체의 행위</li>
              </ol>
              <p>② 회사는 이용자가 상기 금지 행위를 한 경우 이용계약을 해지하거나 서비스 이용을 제한할 수 있습니다.</p>
            </div>
          </section>

          {/* 제7조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제7조 (콘텐츠의 권리 및 책임)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 이용자가 서비스 내에 게시한 콘텐츠에 대한 저작권은 해당 이용자에게 귀속됩니다.</p>
              <p>② 이용자는 서비스 내에 콘텐츠를 게시함으로써 회사에 대해 서비스 운영, 홍보, 개선을 위한 목적으로 해당 콘텐츠를 사용할 수 있는 비독점적·전 세계적·무상의 라이선스를 부여합니다.</p>
              <p>③ 이용자가 게시한 콘텐츠로 인해 발생하는 모든 분쟁 및 법적 문제에 대한 책임은 해당 이용자에게 있습니다.</p>
            </div>
          </section>

          {/* 제8조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제8조 (개인정보 보호)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 회사는 관련 법령에 따라 이용자의 개인정보를 보호하며, 개인정보의 수집·이용에 관해서는 별도의 개인정보 처리방침을 통해 안내합니다.</p>
              <p>② 회사의 개인정보 처리방침은 서비스 내 &quot;개인정보 처리방침&quot; 링크를 통해 확인할 수 있습니다.</p>
            </div>
          </section>

          {/* 제9조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제9조 (서비스 중단)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 회사는 시스템 점검, 보수, 교체 또는 고장, 통신 두절 등의 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.</p>
              <p>② 회사는 서비스 중단으로 인해 이용자가 입는 손해에 대해, 회사의 귀책사유가 없는 한 책임을 지지 않습니다.</p>
              <p>③ 회사가 서비스를 완전히 종료하고자 하는 경우 서비스 종료 30일 이전에 공지합니다.</p>
            </div>
          </section>

          {/* 제10조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제10조 (면책조항)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</p>
              <p>② 회사는 이용자의 귀책사유로 발생한 서비스 이용 장애에 대해 책임을 지지 않습니다.</p>
              <p>③ 회사는 이용자가 서비스를 통해 기대하는 수익이나 성과를 얻지 못한 것에 대해 책임을 지지 않습니다.</p>
            </div>
          </section>

          {/* 제11조 */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-Label-Primary border-l-2 border-green-600 pl-3">
              제11조 (분쟁 해결)
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-2">
              <p>① 이 약관과 관련된 분쟁에 대해서는 대한민국 법률을 준거법으로 합니다.</p>
              <p>② 서비스 이용으로 발생한 분쟁에 대한 소송은 민사소송법에 따른 관할 법원에 제기합니다.</p>
            </div>
          </section>

          {/* 부칙 */}
          <section className="space-y-3 border-t border-border-card pt-6">
            <h2 className="text-base font-semibold text-Label-Primary">
              부칙
            </h2>
            <div className="text-sm text-Label-Tertiary leading-relaxed space-y-1">
              <p>이 약관은 2026년 1월 1일부터 시행합니다.</p>
              <p className="mt-3 text-xs text-Label-Tertiary/60">
                문의사항: contact@overall.com<br />
                주소: 경기도 수원시 영통구 봉영로 1744번길 16 248동 1702호<br />
                사업자등록번호: 302-06-64464
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

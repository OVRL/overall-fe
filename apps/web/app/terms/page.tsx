import Footer from "@/components/ui/Footer";
import TermsBackButton from "./_components/TermsBackButton";

/**
 * 이용약관 전문 페이지.
 * Confluence 게시본과 동기화한 뒤, 플레이스홀더([ ])만 법무·운영에서 치환해 주세요.
 */
export default function TermsPage() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-black text-Label-Primary pt-safe">
      <main className="box-border mx-auto w-full max-w-layout flex-1 px-4 py-6 md:py-10 xl:max-w-[1336px]">
        <div className="mb-8">
          <TermsBackButton />
        </div>
        <article className="w-full rounded-2xl border border-[#252525] bg-[#151515] p-6 md:p-12 space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold text-white leading-9">
              이용약관
            </h1>
            <p className="text-sm text-[#888] leading-relaxed">
              시행일: [서비스 런칭 일자]
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제1조 (목적)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              본 약관은 오버롤(이하 &quot;서비스&quot;)이 제공하는 풋살/축구 팀
              관리 및 기록 서비스의 이용과 관련하여 서비스와 이용자 간의 권리,
              의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제2조 (정의)
            </h2>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>
                &quot;서비스&quot;란 오버롤 앱 및 관련 제반 서비스를 의미합니다.
              </li>
              <li>
                &quot;이용자&quot;란 본 약관에 동의하고 서비스를 이용하는 회원을
                의미합니다.
              </li>
              <li>
                &quot;팀 관리자&quot;란 팀을 생성하거나 감독/코치 권한을 부여받은
                이용자를 의미합니다.
              </li>
              <li>
                &quot;콘텐츠&quot;란 이용자가 서비스 내에서 생성한 경기 기록,
                포메이션, MOM 투표 결과 등 일체의 데이터를 의미합니다.
              </li>
              <li>
                &quot;법정대리인&quot;이란 만 14세 미만 이용자의 부모 또는
                후견인을 의미합니다.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제3조 (약관의 게시 및 변경)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 본 약관을 앱 내 접근 가능한 화면에 게시합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 서비스는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수
              있으며, 변경 시 시행일 7일 전(중요 사항은 30일 전)부터
              공지합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ③ 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고
              탈퇴할 수 있습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제4조 (이용 계약의 성립 및 14세 미만 가입자 처리)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 이용자는 회원가입 시 본 약관에 동의함으로써 이용 계약이
              성립합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 만 14세 미만 이용자의 가입 절차
            </p>
            <div className="rounded-[0.875rem] border border-[#B8FF12]/30 p-6 space-y-3">
              <p className="text-[#A6A5A5] leading-relaxed">
                「개인정보 보호법」 제22조의2에 따라, 만 14세 미만 아동은
                법정대리인의 동의를 받아야 서비스를 이용할 수 있습니다.
              </p>
            </div>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>
                회원가입 시 생년월일을 입력하면 서비스가 자동으로 14세 미만
                여부를 확인합니다.
              </li>
              <li>
                14세 미만으로 확인된 경우, 법정대리인의 성명 및 연락처(전화번호)를
                입력합니다.
              </li>
              <li>
                서비스는 입력된 연락처로 법정대리인에게 동의 확인 메시지를
                발송하고, 법정대리인의 동의 완료 후 회원가입이 승인됩니다.
              </li>
              <li>
                법정대리인은 14세 미만 이용자의 서비스 이용 및 개인정보 처리에
                관한 모든 동의를 대신하며, 언제든지 동의를 철회할 수 있습니다.
              </li>
              <li>
                법정대리인의 동의 없이 가입한 사실이 확인된 경우, 서비스는 해당
                계정을 즉시 삭제할 수 있습니다.
              </li>
            </ul>
            <p className="text-[#A6A5A5] leading-relaxed pt-2">
              ③ 서비스는 아래에 해당하는 경우 가입 신청을 거부할 수 있습니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>실명이 아니거나 타인의 정보를 도용한 경우</li>
              <li>
                14세 미만 이용자가 법정대리인 동의 없이 가입을 시도하는 경우
              </li>
              <li>
                이전에 서비스 이용 제한을 받은 이용자가 재가입을 시도하는 경우
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제5조 (서비스 제공 내용)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              서비스는 다음의 기능을 제공합니다.
            </p>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6">
              <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
                <li>
                  계정 및 선수 프로필 관리: 회원가입, 로그인, 선수명/포지션/페이스온
                  등록
                </li>
                <li>
                  팀 생성 및 관리: 팀 생성, 초대코드 기반 팀 가입, 권한
                  관리(감독/코치/선수), 복수 팀 소속
                </li>
                <li>
                  경기 관리: 경기 등록(매칭/내전), 일정·장소·쿼터 설정, 경기 수정
                  및 삭제
                </li>
                <li>
                  참여 및 운영: 참석 투표, 쿼터별 포메이션 설정 및 선수 배치,
                  임시 저장
                </li>
                <li>
                  경기 결과 및 기록: 스코어 입력, 득점·도움 기록, 출장·승패 기록
                  조회
                </li>
                <li>
                  MOM 투표: 경기 후 투표, TOP3 결과 노출, 카드형 결과 UI
                </li>
                <li>
                  경쟁·동기 유도: 개인 오버롤 지표, 팀 내 기록 랭킹, 명예의
                  전당, 베스트 11
                </li>
                <li>
                  카카오 알림톡: 경기 일정, 참석 투표, MOM 결과 등 서비스 관련
                  알림
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제6조 (서비스 이용 시간 및 중단)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 연중무휴 24시간 제공을 원칙으로 합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 다음의 경우 서비스 제공이 일시 중단될 수 있습니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>시스템 정기 점검, 긴급 보수 및 설비 공사</li>
              <li>천재지변, 국가 비상사태, 정전 등 불가항력적 사유</li>
              <li>카카오(주) 등 외부 플랫폼 서비스 장애</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제7조 (이용자의 의무)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              이용자는 다음의 행위를 해서는 안 됩니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>타인의 계정 도용 또는 허위 정보 등록</li>
              <li>
                법정대리인 동의 없이 만 14세 미만 이용자의 가입을 유도하는 행위
              </li>
              <li>서비스를 이용한 영리 행위 (서비스의 사전 서면 동의 없이)</li>
              <li>서비스 운영을 방해하거나 서버에 과도한 부하를 주는 행위</li>
              <li>다른 이용자의 개인정보 무단 수집·이용</li>
              <li>서비스 내 허위 기록 등록 또는 MOM 투표 조작</li>
              <li>관련 법령 또는 본 약관이 금지하는 일체의 행위</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제8조 (서비스의 권리)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 이용자가 본 약관을 위반한 경우 서비스 이용 제한 또는
              계정 삭제 조치를 취할 수 있습니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 14세 미만 이용자의 법정대리인이 동의를 철회하는 경우 서비스는
              해당 이용자의 계정을 삭제하고 개인정보를 파기합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제9조 (콘텐츠의 권리 관계)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 이용자가 서비스 내에서 생성한 콘텐츠의 저작권은 이용자에게
              귀속됩니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 이용자는 서비스가 콘텐츠를 서비스 운영 및 개선 목적으로 활용할
              수 있도록 비독점적, 무상의 라이선스를 서비스에 부여합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제10조 (면책 조항)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 이용자 간 또는 이용자와 제3자 간의 분쟁에 대해 책임지지
              않습니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 서비스는 이용자가 입력한 경기 기록의 정확성을 보증하지 않으며,
              해당 정보로 인한 분쟁에 대해 책임지지 않습니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ③ 카카오(주)의 서비스 장애로 인한 알림 발송 지연·실패에 대해서는
              책임을 제한합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제11조 (회원 탈퇴)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 이용자는 앱 내 [설정 &gt; 계정 관리 &gt; 탈퇴]를 통해 언제든지
              탈퇴를 신청할 수 있습니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 14세 미만 이용자의 탈퇴는 법정대리인도 요청할 수 있습니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ③ 이용자가 팀 관리자인 경우, 탈퇴 전 팀 권한 이전 또는 팀 해산이
              필요합니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제12조 (준거법 및 분쟁 해결)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련하여
              분쟁이 발생한 경우 관련 법령에 따른 절차를 통해 해결합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              본 약관은 [서비스 런칭 일자]부터 시행됩니다.
            </p>
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

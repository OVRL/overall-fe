import Footer from "@/components/ui/Footer";
import PrivacyPolicyBackButton from "./_components/PrivacyPolicyBackButton";
/**
 * 개인정보 처리방침 전문 페이지.
 * 법무 검토 후 본문을 교체해 주세요.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-black text-Label-Primary pt-safe">
      <main className="box-border mx-auto w-full max-w-layout flex-1 px-4 py-6 md:py-10 xl:max-w-[1336px]">
        <div className="mb-8">
          <PrivacyPolicyBackButton />
        </div>
        <article className="w-full rounded-2xl border border-[#252525] bg-[#151515] p-6 md:p-12 space-y-6">
          <h1 className="text-3xl font-bold text-white leading-9">
            개인정보 처리방침
          </h1>
          <p className="text-[#A6A5A5] leading-relaxed">
            Overall(이하 &quot;회사&quot;)는 서비스 제공을 위해 다음과 같이
            최소한의 정보만을 수집 및 이용합니다.
          </p>
          <p className="text-[#A6A5A5]  mt-4">
            회사가 개인정보 관련 법령을 준수하고, 각종 서비스의 제공을 위해
            이용자분의 개인정보를 보호하고자 노력하고 있습니다.
          </p>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-white leading-7">
              [필수] 개인정보 수집 및 이용 동의 전문
            </h2>
            <div className="rounded-[0.875rem] border-[#252525] bg-surface-card p-8 flex flex-col gap-4">
              <p className="text-[#A6A5A5]">
                (주)오버롤은 서비스 제공을 위해 다음과 같이 최소한의 정보만을
                수집 및 이용합니다.
              </p>
              <p className="text-[#A6A5A5]">
                회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같이
                개인정보를 수집 및 이용하고자 합니다.
              </p>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">
              2. 수집 및 이용 목적
            </h2>
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full min-w-xl text-left text-sm border-collapse">
                <caption className="sr-only">
                  개인정보 수집·이용 목적, 항목, 보유 기간 안내
                </caption>
                <thead>
                  <tr className="border-b border-[#252525]">
                    <th
                      scope="col"
                      className="py-3 pr-4 font-semibold text-white align-top w-[40%]"
                    >
                      수집 및 이용 목적
                    </th>
                    <th
                      scope="col"
                      className="py-3 pr-4 font-semibold text-white align-top w-[15%]"
                    >
                      구분
                    </th>
                    <th
                      scope="col"
                      className="py-3 pr-4 font-semibold text-white align-top w-[25%]"
                    >
                      수집 항목
                    </th>
                    <th
                      scope="col"
                      className="py-3 font-semibold text-white align-top w-[20%]"
                    >
                      보유 및 이용 기간
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[#A6A5A5]">
                  <tr className="border-b border-[#252525]">
                    <td className="py-4 pr-4 align-top leading-relaxed" rowSpan={2}>
                      회원 가입 의사 확인, 이용자 식별, 서비스 통계·최적화,
                      부정·무단 이용 방지
                    </td>
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      <span className="inline-block rounded px-1.5 py-0.5 text-xs font-semibold bg-[#B8FF12]/10 text-[#B8FF12]">필수</span>
                    </td>
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      이름, 이메일, 카카오계정(전화번호)
                    </td>
                    <td className="py-4 align-top leading-relaxed" rowSpan={2}>
                      회원 탈퇴 시 즉시 파기
                    </td>
                  </tr>
                  <tr className="border-b border-[#252525]">
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      <span className="inline-block rounded px-1.5 py-0.5 text-xs font-semibold bg-[#555]/30 text-[#A6A5A5]">선택</span>
                    </td>
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      성별, 생일, 출생 연도, 연령대
                    </td>
                  </tr>
                  <tr className="border-b border-[#252525]">
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      서비스 내 이용자 간 소셜 활동(팀 매칭, 팀원 초대, 친구에게 알림 전송)
                    </td>
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      <span className="inline-block rounded px-1.5 py-0.5 text-xs font-semibold bg-[#555]/30 text-[#A6A5A5]">선택</span>
                    </td>
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      카카오톡 친구 목록, 카카오톡 메시지 전송 권한
                    </td>
                    <td className="py-4 align-top leading-relaxed">
                      이용 목적 달성 즉시 파기
                    </td>
                  </tr>
                  <tr className="border-b border-[#252525]">
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      서비스 이용에 따른 CS(고객상담) 처리, 공지사항 전달
                    </td>
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      <span className="inline-block rounded px-1.5 py-0.5 text-xs font-semibold bg-[#B8FF12]/10 text-[#B8FF12]">필수</span>
                    </td>
                    <td className="py-4 pr-4 align-top leading-relaxed">
                      서비스 이용기록, 접속 로그, 쿠키, IP 정보
                    </td>
                    <td className="py-4 align-top leading-relaxed">
                      회원 탈퇴 시 즉시 파기
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">
              3. 카카오톡 친구 목록 및 메시지 전송 권한 이용 안내
            </h2>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6 space-y-3 text-sm text-[#A6A5A5] leading-relaxed">
              <p>
                회사는 카카오 로그인을 통해 제공되는 <strong className="text-white">카카오톡 친구 목록</strong> 및{" "}
                <strong className="text-white">메시지 전송</strong> 권한을 아래 목적으로만 사용합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>
                  서비스 내 이용자 간 소셜 활동 지원: 팀원 초대, 팀 매칭 알림, 경기 일정 공유 등
                </li>
                <li>
                  친구 목록은 본인이 앱과 연결되어 있으며 친구 목록 제공에 동의한 카카오 사용자에 한해 제공됩니다.
                </li>
                <li>
                  메시지 전송은 이용자가 명시적으로 요청한 경우에만 발송되며, 광고·마케팅 목적으로는 사용되지 않습니다.
                </li>
              </ul>
              <p className="text-xs text-[#666]">
                ※ 카카오톡 메시지 API는 일 기본 쿼터 내에서만 사용되며, 서비스 내 사용자 간 소셜 활동 범위를 초과하여 사용하지 않습니다.
              </p>
            </div>
          </section>

          <div className="rounded-[0.875rem] border border-[#B8FF12]/30 p-6 space-y-4">
            <p className="text-[#A6A5A5] leading-relaxed">
              ※ 동의를 거부할 권리 및 불이익: 귀하는 개인정보 수집 및 이용에
              대해 동의하지 않으실 수 있으며, 다만, 동의하지 않으실 경우 서비스
              이용에 제약을 받을 수 있습니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              단, 법령에 의하여 의무적으로 보관하여야 하는 경우에는 해당
              법령에서 정한 기간 및 범위 내에서만 보관합니다. (예: 「전자상거래
              등에서의 소비자 보호에 관한 법률」에 따른 계약 또는 청약철회 등에
              관한 기록 5년 보관 등)
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">
              개인정보의 제3자 제공
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc list-inside text-[#A6A5A5] space-y-2 pl-4">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와
                방법에 따라 수사기관의 요구가 있는 경우
              </li>
            </ul>
          </section>

          <section className="space-y-3 mt-8">
            <h2 className="text-xl font-semibold text-white">
              개인정보의 파기
            </h2>
            <p className=" text-[#A6A5A5] leading-relaxed">
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
              불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
            <p className=" text-[#A6A5A5] leading-relaxed">
              전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록
              파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나
              소각하여 파기합니다.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold text-white">
              개인정보보호 책임자
            </h2>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6">
              <dl className="text-[#A6A5A5] space-y-2">
                <div>
                  <dt className="inline font-medium text-white">담당부서: </dt>
                  <dd className="inline">개인정보보호팀</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-white">이메일: </dt>
                  <dd className="inline">
                    <a
                      href="mailto:privacy@overall.com"
                      className="text-Label-AccentPrimary hover:opacity-90 underline-offset-2"
                    >
                      privacy@overall.com
                    </a>
                  </dd>
                </div>
              </dl>
              <p className=" text-[#A6A5A5] leading-relaxed mt-2">
                개인정보와 관련한 문의사항이 있으시면 위 연락처로 연락 주시기
                바랍니다.
              </p>
            </div>
          </section>

          <footer className="mt-12 pt-8 space-y-1 text-sm leading-5 text-[#666] border-t border-[#252525]">
            <p>공고일자: 2026년 3월 1일</p>
            <p>시행일자: 2026년 3월 1일</p>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}

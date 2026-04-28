import Footer from "@/components/ui/Footer";
import PrivacyPolicyBackButton from "./_components/PrivacyPolicyBackButton";

/**
 * 개인정보 처리방침 전문 페이지.
 * Confluence 게시본과 동기화한 뒤, 플레이스홀더([ ])만 법무·운영에서 치환해 주세요.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-black text-Label-Primary pt-safe">
      <main className="box-border mx-auto w-full max-w-layout flex-1 px-4 py-6 md:py-10 xl:max-w-334">
        <div className="mb-8">
          <PrivacyPolicyBackButton />
        </div>
        <article className="w-full rounded-2xl border border-[#252525] bg-[#151515] p-6 md:p-12 space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl font-bold text-white leading-9">
              개인정보 처리방침
            </h1>
            <p className="text-sm text-[#888] leading-relaxed">
              시행일: [서비스 런칭 일자]
            </p>
          </header>

          <p className="text-[#A6A5A5] leading-relaxed">
            오버롤(이하 &quot;서비스&quot;)은 이용자의 개인정보를 중요하게
            생각하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호
            등에 관한 법률」(이하 &quot;정보통신망법&quot;) 및 관련 법령을
            준수합니다.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제1조 (수집하는 개인정보 항목 및 수집 방법)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를
              수집합니다. 각 항목의 필수/선택 여부는 아래 표를 따릅니다.
            </p>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6 space-y-4">
              <p className="text-white font-medium text-sm">
                회원가입 및 서비스 이용 시 수집 항목
              </p>

              <div className="overflow-x-auto">
                <table className="w-full min-w-170 border-separate border-spacing-0 text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="min-w-15 px-3 py-2 text-white border-b border-[#252525]">
                        구분
                      </th>
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        수집 항목
                      </th>
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        수집·이용 목적
                      </th>
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        보유·이용 기간
                      </th>
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        수집 방법
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[#A6A5A5] leading-relaxed">
                    <tr>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        필수
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        이름, 성별, 생일, 출생 연도, 카카오계정(전화번호)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원 식별 및 가입 처리, 이용자 프로필 구성, 연령 확인(만
                        14세 미만 여부 포함), 서비스 부정 이용 방지, 서비스 제공
                        및 고객 지원
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원 탈퇴 시까지 (단, 관련 법령에 따라 보관이 필요한
                        경우 해당 기간)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원가입 시 이용자 직접 입력 또는 소셜 로그인(카카오)
                        동의에 따른 제공 정보 수집
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        선택
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        연령대
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        서비스 맞춤 기능 제공(콘텐츠/기능 추천 등), 통계
                        분석(비식별 처리 후 활용)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원 탈퇴 시까지 또는 선택 항목 동의 철회 시까지
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원가입/온보딩 과정에서 이용자 직접 입력 또는 소셜
                        로그인 동의에 따른 제공 정보 수집
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        필수
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        계정 정보: 이메일, 소셜 계정 식별값(카카오, 네이버,
                        구글)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        로그인/인증 및 계정 관리, 본인 확인, 서비스 이용 내역
                        관리
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원 탈퇴 시까지 (단, 관련 법령에 따라 보관이 필요한
                        경우 해당 기간)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원가입 시 이용자 직접 입력 또는 소셜 로그인 제공 정보
                        수집
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        필수
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        선수 프로필: 선수명(닉네임), 포지션, 페이스온 정보
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        선수 프로필 생성 및 서비스 제공(팀 운영/경기 관리/기록
                        연동)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원 탈퇴 시까지 (탈퇴 시 개인 식별 정보는 삭제, 경기
                        기록은 익명화 처리 후 보존 가능)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원가입/온보딩 과정에서 이용자 직접 입력
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        필수
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        팀 정보: 팀 이름, 소속 팀 정보, 권한(감독/코치/선수)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        팀 구성 및 관리, 권한 부여, 팀 단위 서비스 제공
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원 탈퇴 시까지 (팀 단위 기록은 익명화 처리 후 보존
                        가능)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        서비스 이용 과정에서 이용자 직접 입력 또는 팀 초대 승인
                        과정에서 수집
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        필수
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        경기 기록: 출장, 득점, 도움, 승패 기록
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        경기 운영, 통계 제공, 팀/개인 기록 조회
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        회원 탈퇴 시 개인 식별 정보 삭제 후 익명화 처리하여 팀
                        기록으로 보존
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        서비스 이용 과정에서 자동 생성 또는 팀/감독 등 권한자
                        입력
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 align-top">선택</td>
                      <td className="px-3 py-3 align-top">
                        카카오톡 수신을 위한 카카오 계정 정보(알림톡 수신 동의
                        시)
                      </td>
                      <td className="px-3 py-3 align-top">
                        카카오 알림톡을 통한 경기 일정/참석 투표/MOM 결과 등
                        서비스 관련 알림 발송
                      </td>
                      <td className="px-3 py-3 align-top">
                        회원 탈퇴 시까지 또는 알림 수신 동의 철회 시까지
                      </td>
                      <td className="px-3 py-3 align-top">
                        이용자 동의 후 카카오 연동 정보 수집
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-white font-medium text-sm">
                  카카오 로그인(카카오계정) 연동 시 제공받을 수 있는 항목
                </p>
                <p className="text-[#A6A5A5] leading-relaxed text-sm">
                  아래 항목은 이용자가 카카오 동의 화면에서 동의한 범위 내에서
                  카카오로부터 제공받아 수집할 수 있습니다. 실제 제공 여부는
                  이용자의 동의 및 카카오 정책/계정 설정에 따라 달라질 수
                  있습니다.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-170 border-separate border-spacing-0 text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="px-3 py-2 text-white border-b border-[#252525]">
                          구분
                        </th>
                        <th className="px-3 py-2 text-white border-b border-[#252525]">
                          항목
                        </th>
                        <th className="px-3 py-2 text-white border-b border-[#252525]">
                          필수/선택
                        </th>
                        <th className="px-3 py-2 text-white border-b border-[#252525]">
                          이용 목적
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[#A6A5A5] leading-relaxed">
                      <tr>
                        <td className="px-3 py-3 align-top border-b border-[#252525]">
                          개인정보 동의 항목
                        </td>
                        <td className="px-3 py-3 align-top border-b border-[#252525]">
                          이름, 성별, 생일, 출생 연도, 카카오계정(전화번호)
                        </td>
                        <td className="px-3 py-3 align-top border-b border-[#252525]">
                          필수
                        </td>
                        <td className="px-3 py-3 align-top border-b border-[#252525]">
                          회원가입 및 본인 확인, 연령 확인(만 14세 미만 여부
                          포함), 서비스 제공 및 고객 지원
                        </td>
                      </tr>
                      <tr>
                        <td className="px-3 py-3 align-top">
                          개인정보 동의 항목
                        </td>
                        <td className="px-3 py-3 align-top">연령대</td>
                        <td className="px-3 py-3 align-top">선택</td>
                        <td className="px-3 py-3 align-top">
                          맞춤 기능 제공, 통계 분석(비식별 처리 후 활용)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-white font-medium text-sm pt-4">
                14세 미만 이용자 추가 수집 항목
              </p>
              <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
                <li>
                  법정대리인(부모 등)의 성명, 연락처 (법정대리인 동의 확인 목적)
                </li>
              </ul>

              <p className="text-white font-medium text-sm pt-2">
                자동 수집 항목
              </p>
              <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
                <li>서비스 이용 기록, 접속 로그, 기기 정보 (OS, 앱 버전)</li>
              </ul>
            </div>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 수집 방법: 회원가입/온보딩 시 이용자 직접 입력, 소셜
              로그인(카카오) 동의에 따른 제공 정보 수집, 서비스 이용 과정에서
              자동 생성, 법정대리인 동의 절차를 통한 수집
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제2조 (14세 미만 아동의 개인정보 보호)
            </h2>
            <div className="rounded-[0.875rem] border border-[#B8FF12]/30 p-6 space-y-3">
              <p className="text-[#A6A5A5] leading-relaxed">
                「개인정보 보호법」 제22조의2에 따라 만 14세 미만 아동의
                개인정보 수집 시 법정대리인의 동의가 필요합니다.
              </p>
            </div>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 만 14세 미만의 이용자가 회원가입을 신청하는 경우,
              법정대리인(부모 또는 후견인)의 동의를 받은 후 서비스를 제공합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 법정대리인 동의 절차는 다음과 같습니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>
                회원가입 시 생년월일을 입력하여 14세 미만 여부를 확인합니다.
              </li>
              <li>
                14세 미만으로 확인된 경우, 법정대리인의 성명 및 연락처를
                입력합니다.
              </li>
              <li>
                서비스는 입력된 연락처로 법정대리인에게 동의 확인 메시지를
                발송합니다.
              </li>
              <li>법정대리인이 동의를 완료한 이후 회원가입이 승인됩니다.</li>
            </ul>
            <p className="text-[#A6A5A5] leading-relaxed">
              ③ 법정대리인은 14세 미만 이용자의 개인정보 열람, 수정, 삭제를
              요청할 권리가 있습니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ④ 14세 미만 이용자에게는 마케팅 수신 동의(광고성 정보 발송)를
              요청하지 않습니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제3조 (개인정보의 수집 및 이용 목적)
            </h2>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>
                회원 가입 및 관리: 본인 확인, 계정 생성 및 유지, 서비스 부정
                이용 방지
              </li>
              <li>
                이용자 프로필 구성: 이름/성별/생년(출생 연도) 및 생일 정보
                기반의 프로필 구성 및 이용자 식별
              </li>
              <li>
                연령 확인 및 보호 조치: 만 14세 미만 여부 확인, 법정대리인 동의
                절차 수행
              </li>
              <li>
                서비스 제공: 경기 관리, 팀 운영, 포메이션 설정, MOM 투표, 기록
                조회
              </li>
              <li>
                선수 기록 및 통계 제공: 개인 오버롤 지표, 득점/도움/출장 기록,
                팀 내 랭킹
              </li>
              <li>
                알림 발송: 카카오 알림톡을 통한 경기 일정, 참석 투표, MOM 결과
                등 서비스 관련 알림
              </li>
              <li>
                맞춤 기능 제공(선택): 이용자가 동의한 경우 연령대 기반의 맞춤
                기능 제공 및 통계 분석(비식별 처리 후 활용)
              </li>
              <li>
                광고성 정보 발송: 마케팅 수신 동의를 한 이용자(만 14세 이상)에
                한하여 카카오 친구톡 등을 통한 광고성 메시지 발송
              </li>
              <li>고객 지원: 문의 처리 및 민원 대응</li>
              <li>
                서비스 개선: 이용 현황 분석 및 신규 기능 개발 (비식별 처리 후
                활용)
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제4조 (개인정보의 보유 및 이용 기간)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 이용자의 개인정보를 회원 탈퇴 시까지 보유·이용하며,
              탈퇴 후 지체 없이 파기합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 단, 관련 법령에 따라 아래와 같이 일정 기간 보관합니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>
                전자상거래 등에서의 소비자 보호에 관한 법률: 계약 또는 청약철회
                기록 5년, 대금결제 기록 5년
              </li>
              <li>통신비밀보호법: 로그인 기록 3개월</li>
              <li>전자금융거래법: 전자금융 거래기록 5년</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제5조 (개인정보의 제3자 제공)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단,
              아래의 경우는 예외로 합니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 따라 수사기관 등의 요청이 있는 경우</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제6조 (개인정보 처리의 위탁)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              서비스는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를
              위탁합니다.
            </p>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6 space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full min-w-170 border-separate border-spacing-0 text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        수탁자
                      </th>
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        위탁 업무 내용
                      </th>
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        위탁되는 개인정보 항목
                      </th>
                      <th className="px-3 py-2 text-white border-b border-[#252525]">
                        보유·이용 기간
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[#A6A5A5] leading-relaxed">
                    <tr>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        카카오(주)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        카카오 알림톡·친구톡을 통한 서비스 알림 및 광고성 메시지
                        발송
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        카카오 사용자 식별값, 전화번호(알림 수신 동의 시),
                        메시지 발송을 위한 정보(메시지 내용/템플릿 식별 정보 등)
                      </td>
                      <td className="px-3 py-3 align-top border-b border-[#252525]">
                        위탁 계약 종료 또는 회원 탈퇴/동의 철회 시까지
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-3 align-top">
                        클라우드 인프라 서비스 사업자
                      </td>
                      <td className="px-3 py-3 align-top">
                        서버 운영 및 데이터 보관(백업 포함)
                      </td>
                      <td className="px-3 py-3 align-top">
                        서비스 운영 과정에서 저장·처리되는 개인정보 일체
                      </td>
                      <td className="px-3 py-3 align-top">
                        위탁 계약 종료 또는 회원 탈퇴 시까지 (관련 법령에 따라
                        보관이 필요한 경우 해당 기간)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[#A6A5A5] leading-relaxed text-sm">
                서비스는 위탁계약 체결 시 관련 법령에 따라 개인정보가 안전하게
                관리될 수 있도록 필요한 사항을 규정하고, 수탁자에 대한
                관리·감독을 수행합니다.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제7조 (이용자 및 법정대리인의 권리와 행사 방법)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 이용자(14세 미만의 경우 법정대리인 포함)는 언제든지 다음의
              권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>개인정보 열람 요청</li>
              <li>오류 정정 요청</li>
              <li>삭제 요청</li>
              <li>처리 정지 요청</li>
            </ul>
            <p className="text-[#A6A5A5] leading-relaxed">
              ② 권리 행사는 앱 내 [설정 &gt; 계정 관리] 또는 개인정보
              보호책임자(하단 참조)에게 연락하시면 처리해 드립니다.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제8조 (개인정보의 파기)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              ① 서비스는 보유 기간이 경과하거나 처리 목적이 달성된 개인정보는
              지체 없이 파기합니다.
            </p>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>전자적 파일: 복구 불가능한 방식으로 영구 삭제</li>
              <li>출력물 등 비전자적 기록: 분쇄 또는 소각</li>
              <li>
                법정대리인 동의 확인 기록: 회원 탈퇴 또는 법정대리인 동의 철회
                후 즉시 파기
              </li>
            </ul>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6 space-y-3">
              <h3 className="text-base font-semibold text-white">
                탈퇴 회원의 경기 기록 처리
              </h3>
              <p className="text-[#A6A5A5] leading-relaxed">
                오버롤은 팀 단위로 경기 기록이 공유되는 서비스 특성상, 특정
                이용자의 탈퇴로 인해 다른 팀원의 경기 데이터에 영향이 생기는
                것을 방지하기 위해 아래와 같이 처리합니다.
              </p>
              <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
                <li>
                  탈퇴 시 선수명, 이메일 등 개인 식별 정보는 즉시 삭제합니다.
                </li>
                <li>
                  해당 이용자가 참여한 경기의 득점·도움·출장 기록 등은 익명화
                  처리 후 팀 기록으로 보존합니다.
                </li>
                <li>
                  익명화된 기록은 특정 개인을 식별할 수 없는 형태로만 유지되며,
                  개인정보로 취급하지 않습니다.
                </li>
                <li>
                  익명화 처리란 특정 개인을 식별할 수 없도록 이름, 이메일 등
                  식별 정보를 제거하고, 다른 정보와 결합하더라도 개인을 식별할
                  수 없는 상태를 의미합니다.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제9조 (개인정보 보호를 위한 기술적·관리적 조치)
            </h2>
            <ul className="list-disc list-outside text-[#A6A5A5] space-y-2 pl-5 leading-relaxed">
              <li>
                이용자의 개인정보는 암호화하여 안전하게 저장 및 관리됩니다.
              </li>
              <li>전송 구간 SSL/TLS 암호화 적용</li>
              <li>접근 권한 최소화 및 내부 접근 로그 관리</li>
              <li>개인정보 취급 직원 대상 보안 교육 실시</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white leading-7">
              제10조 (개인정보 보호책임자)
            </h2>
            <div className="rounded-[0.875rem] border border-[#252525] bg-surface-card p-6">
              <dl className="text-[#A6A5A5] space-y-2">
                <div>
                  <dt className="inline font-medium text-white">성명: </dt>
                  <dd className="inline">[담당자명]</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-white">이메일: </dt>
                  <dd className="inline">
                    <span className="text-Label-AccentPrimary">
                      [이메일 주소]
                    </span>
                  </dd>
                </div>
              </dl>
              <p className="text-[#A6A5A5] leading-relaxed mt-4">
                개인정보와 관련한 문의사항이 있으시면 위 연락처로 연락 주시기
                바랍니다.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white leading-7">
              제11조 (개인정보처리방침의 변경)
            </h2>
            <p className="text-[#A6A5A5] leading-relaxed">
              본 방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시
              앱 공지사항을 통해 사전 고지합니다.
            </p>
            <p className="text-[#A6A5A5] leading-relaxed">
              본 방침은 [서비스 런칭 일자]부터 시행됩니다.
            </p>
          </section>

          <div className="rounded-[0.875rem] border border-[#B8FF12]/30 p-6 space-y-3">
            <p className="text-[#A6A5A5] leading-relaxed text-sm">
              ※ 동의를 거부할 권리 및 불이익: 귀하는 개인정보 수집 및 이용에
              대해 동의하지 않으실 수 있으며, 다만 동의하지 않으실 경우 서비스
              이용에 제약을 받을 수 있습니다.
            </p>
          </div>

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

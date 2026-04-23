const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/(main)/player/[name]/history/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const startLineIdx = 330; // Line 331 is index 330
const endLineIdx = 533; // Line 534 is index 533

const newLayout = `    <div className="relative z-10 w-full min-h-[calc(100vh-env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] bg-gray-50 dark:bg-background pb-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 md:py-16 flex flex-col gap-8 md:gap-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 border-b border-Label-Tertiary/10 pb-5 md:pb-6">
          <div className="flex flex-col gap-2.5 md:gap-3">
            <div className="flex items-center gap-3 md:gap-4">
               <button 
                onClick={() => router.back()}
                className="group flex flex-shrink-0 items-center justify-center w-9 md:w-10 h-9 md:h-10 bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-elevated transition-all shadow-sm dark:shadow-none cursor-pointer"
               >
                 <ArrowLeft className="w-4.5 md:w-5 h-4.5 md:h-5 text-Label-Primary group-hover:-translate-x-0.5 transition-transform" />
               </button>
               <h1 className="text-2xl md:text-4xl font-extrabold text-Label-Primary tracking-tight uppercase m-0 leading-none">{playerName}</h1>
            </div>
            <p className="text-[14px] md:text-[16px] font-semibold text-Label-Tertiary m-0">시즌별 성과 및 성장 추이를 한눈에 확인하세요</p>
          </div>
        </header>

        {/* Section: 올타임 통합 기록 (통산) */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Target className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">올타임 통합 기록 (통산)</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
            {[
              { label: "통산 출장수", val: \`\${stats?.appearances || 0}경기\` },
              { label: "통산 득점", val: \`\${stats?.goals || 0}골\` },
              { label: "통산 도움", val: \`\${stats?.assists || 0}도움\` },
              { label: "통산 공격포인트", val: \`\${stats?.attackPoints || 0}포인트\` },
              { label: "통산 클린시트", val: \`\${stats?.cleanSheets || 0}회\` },
              { label: "MOM TOP 3", val: \`\${stats?.mom3 || 0}회\` },
              { label: "MOM TOP 8", val: \`\${stats?.mom8 || 0}회\` },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-surface-secondary rounded-2xl p-4 md:p-5 flex flex-col gap-1 md:gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-Label-Tertiary/10 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.06)]">
                <span className="text-[12px] md:text-[13px] font-semibold tracking-tight text-Label-Tertiary">{s.label}</span>
                <span className="text-[18px] md:text-[22px] font-black tracking-tight text-Label-Primary leading-tight">{s.val}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: 시즌별 통합 기록 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-100">
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <History className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">시즌별 통합 기록</h3>
          </div>

          <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none p-4 md:p-6 mx-[-16px] sm:mx-0">
             <div className="overflow-x-auto w-full scrollbar-hide">
               <table className="w-full text-left min-w-[800px] border-collapse">
                 <thead>
                   <tr>
                     {["연도", "득점", "도움", "클린시트", "출장", "승/무/패", "승률", "개인승점", "MOM점수", "TOP 3", "TOP 8"].map((h, i) => (
                       <th key={h} className={\`py-3 md:py-4 px-3 text-center text-[12px] md:text-sm font-bold text-Label-Tertiary uppercase border-b border-Label-Tertiary/10 bg-gray-50/50 dark:bg-surface-secondary/50 whitespace-nowrap \${i === 0 ? 'text-left pl-4 md:pl-5' : ''} \${i === 10 ? 'pr-4 md:pr-5' : ''}\`}>
                         {h}
                       </th>
                     ))}
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-Label-Tertiary/5">
                   {historyData.map((r, idx) => (
                     <tr key={r.year} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                       <td className="py-4 md:py-5 px-3 pl-4 md:pl-5 font-black tracking-tight text-[14px] md:text-[15px] whitespace-nowrap">
                         <span className={idx === 0 ? "text-blue-500" : "text-Label-Primary"}>{r.year} {idx === 0 && '(현재)'}</span>
                       </td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.goals}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.assists}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.cleanSheets}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.matches}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[13px] md:text-[15px]">
                         <span className="text-blue-500">{r.win}</span><span className="text-Label-Tertiary mx-0.5">/</span>
                         <span className="text-Label-Tertiary">{r.draw}</span><span className="text-Label-Tertiary mx-0.5">/</span>
                         <span className="text-[#f04452]">{r.lose}</span>
                       </td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.winRate}%</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.personalPoints}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.momScore}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] text-Label-Primary">{r.momTop3Count}</td>
                       <td className="py-4 md:py-5 px-3 text-center font-bold tracking-tight text-[14px] md:text-[15px] pr-4 md:pr-5 text-Label-Primary">{stats?.mom8 || 0}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </section>

        {/* Section: 종항 공격 기여도 & 성장 추이 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-200">
           <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Activity className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">종합 공격 기여도</h3>
           </div>
           
           <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none p-4 md:p-8">
             <div className="w-full h-[250px] md:h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={historyData} margin={{ top: 20, right: 30, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.15)" />
                    <XAxis dataKey="year" stroke="var(--color-Label-Tertiary)" style={{ fontSize: '12px', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="var(--color-Label-Tertiary)" style={{ fontSize: '12px', fontWeight: 600 }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }} />
                    <Line type="monotone" dataKey="goals" stroke="#3182f6" strokeWidth={2.5} name="득점" dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#3182f6' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="assists" stroke="#51cf66" strokeWidth={2.5} name="어시스트" dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#51cf66' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="attackPoints" stroke="#f04452" strokeWidth={2.5} name="공격포인트" dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#f04452' }} activeDot={{ r: 6 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
        </section>

        {/* Section: 상세 분석 (Button Toggle) */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-300">
           <button 
              onClick={toggleGraphs}
              className="w-full flex items-center justify-center gap-2.5 md:gap-3 px-4 py-3 md:py-4 rounded-2xl bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 text-Label-Primary text-[15px] md:text-[16px] font-bold tracking-tight transition-all hover:bg-gray-50 dark:hover:bg-surface-elevated hover:-translate-y-0.5 shadow-sm dark:shadow-none cursor-pointer"
           >
              {showGraphs ? <BarChart2 size={18} className="md:w-5 md:h-5" /> : <Activity size={18} className="md:w-5 md:h-5" />}
              {showGraphs ? '분석 차트 닫기' : '성장 추이 상세 분석하기'}
           </button>

           {showGraphs && (
             <div className="flex flex-col gap-4 md:gap-6 animate-in slide-in-from-top-4 duration-500">
                <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl p-5 md:p-8 flex flex-col gap-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none mt-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h3 className="text-[17px] md:text-[20px] font-bold tracking-tight text-Label-Primary m-0">지표별 성장 추이</h3>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      {[
                        { value: 'goals', label: '득점', color: '#ff6b6b' },
                        { value: 'assists', label: '어시스트', color: '#51cf66' },
                        { value: 'attackPoints', label: '공격포인트', color: '#fcc419' },
                        { value: 'cleanSheets', label: '클린시트', color: '#00e5a0' },
                        { value: 'matches', label: '출장수', color: '#3182f6' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setSelectedStat(opt.value)}
                          style={{
                            backgroundColor: selectedStat === opt.value ? opt.color : 'transparent',
                            borderColor: selectedStat === opt.value ? opt.color : 'rgba(150,150,150,0.2)',
                            color: selectedStat === opt.value ? '#fff' : 'var(--color-Label-Primary)'
                          }}
                          className={\`flex-1 md:flex-none text-center px-3 py-2 md:px-4 md:py-2 rounded-xl border text-[12px] md:text-[14px] font-bold tracking-tight transition-all cursor-pointer \${selectedStat !== opt.value ? 'hover:bg-gray-50 dark:hover:bg-surface-elevated' : ''}\`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-[250px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} domain={[0, getMaxValue(selectedStat)]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey={selectedStat}
                          stroke="#3182f6"
                          strokeWidth={3}
                          dot={{ r: 5, fill: 'white', strokeWidth: 2, stroke: '#3182f6' }}
                          activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-3xl p-5 md:p-8 flex flex-col gap-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none">
                  <h3 className="text-[17px] md:text-[20px] font-bold tracking-tight text-Label-Primary m-0">승/무/패 밸런스</h3>
                  <div className="w-full h-[250px] md:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.1)" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-Label-Tertiary)', fontSize: 12, fontWeight: 600 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" align="right" height={36} wrapperStyle={{ fontSize: '13px', fontWeight: 600 }} />
                        <Line type="monotone" dataKey="win" name="승리" stroke="#3182f6" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="draw" name="무승부" stroke="#adb5bd" strokeWidth={2.5} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="lose" name="패배" stroke="#f04452" strokeWidth={2.5} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
             </div>
           )}
        </section>

        {/* Section: 수상 기록 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-300">
           <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Trophy className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">수상 기록</h3>
           </div>
           
           <div className="bg-white dark:bg-surface-secondary border border-Label-Tertiary/10 rounded-[20px] p-8 lg:p-12 flex flex-col items-center justify-center gap-4 shadow-sm dark:shadow-none min-h-[160px] md:min-h-[200px]">
             <div className="w-12 md:w-14 h-12 md:h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
               <Award className="w-6 md:w-7 h-6 md:h-7 text-amber-500" />
             </div>
             <p className="text-[14px] md:text-[15px] font-bold text-Label-Tertiary">아직 분석된 수상 기록이 없습니다</p>
           </div>
        </section>

        {/* Section: 베스트 파트너 */}
        <section className="flex flex-col gap-3 md:gap-4 animate-in fade-in duration-500 delay-500 mb-10">
           <div className="flex items-center gap-2 mb-1.5 md:mb-2">
             <Users className="w-5 md:w-6 h-5 md:h-6 text-blue-500" />
             <h3 className="text-[18px] md:text-xl font-bold text-Label-Primary m-0">베스트 파트너 (2026 시즌)</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
             {[
               { id: 1, title: '가장 많이 함께 뛴 동료', name: '기록 없음', value: '0쿼터', avatarUrl: '/mom.png' },
               { id: 2, title: '나의 도움으로 득점한 선수', name: '기록 없음', value: '0골', avatarUrl: '/mom.png' },
               { id: 3, title: '가장 많은 도움을 준 선수', name: '기록 없음', value: '0도움', avatarUrl: '/mom.png' },
               { id: 4, title: '함께 클린시트를 만든 선수', name: '기록 없음', value: '0회', avatarUrl: '/mom.png' }
             ].map(opt => (
               <div key={opt.id} className="bg-white dark:bg-surface-secondary rounded-[20px] p-4 md:p-5 flex flex-row items-center gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-none border border-Label-Tertiary/10 transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.02)] hover:-translate-y-0.5 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-Label-Tertiary/10 bg-gray-50 dark:bg-surface-elevated flex-shrink-0 overflow-hidden relative flex items-center justify-center">
                    <img src={opt.avatarUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 opacity-50 dark:opacity-20" />
                  </div>
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                    <span className="text-[11px] md:text-[12px] font-bold text-Label-Tertiary truncate leading-tight">{opt.title}</span>
                    <span className="text-[15px] md:text-[16px] font-black tracking-tight text-Label-Primary truncate">{opt.name}</span>
                    <span className="text-[13px] md:text-[14px] font-bold tracking-tight text-blue-500">{opt.value}</span>
                  </div>
               </div>
             ))}
           </div>
        </section>

      </div>
    </div>`;

const newLines = [...lines.slice(0, startLineIdx), newLayout, ...lines.slice(endLineIdx + 1)];
fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Update complete.');

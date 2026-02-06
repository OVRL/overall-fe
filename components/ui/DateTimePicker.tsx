"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

interface DateTimePickerProps {
    type: "date" | "time";
    initialValue: string;
    onClose: () => void;
    onConfirm: (value: string) => void;
}

export default function DateTimePicker({ type, initialValue, onClose, onConfirm }: DateTimePickerProps) {
    // Date Picker States
    const [currentDate, setCurrentDate] = useState(() => initialValue && type === 'date' ? new Date(initialValue) : new Date());

    // Time Picker States
    const [ampm, setAmpm] = useState("PM");
    const [hour, setHour] = useState("08");
    const [minute, setMinute] = useState("00");

    const ampmRef = useRef<HTMLDivElement>(null);
    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (type === "time" && initialValue) {
            const [h, m] = initialValue.split(":").map(Number);
            setAmpm(h < 12 ? "AM" : "PM");
            setHour(String(h % 12 || 12).padStart(2, "0"));
            setMinute(String(m).padStart(2, "0"));
        }
    }, [type, initialValue]);

    // 스크롤 위치 초기화 (모달 열릴 때)
    useEffect(() => {
        if (type === "time") {
            // 약간의 지연을 주어 렌더링 후 스크롤 되도록 함
            const timer = setTimeout(() => {
                scrollToValue(ampmRef, ampm === "AM" ? 0 : 1);
                scrollToValue(hourRef, parseInt(hour) - 1);
                scrollToValue(minuteRef, parseInt(minute) / 5);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [type]);

    const scrollToValue = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
        if (ref.current) {
            const itemHeight = 40; // h-10
            ref.current.scrollTo({
                top: index * itemHeight,
                behavior: "smooth"
            });
        }
    };

    // Date Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handleDateClick = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        onConfirm(dateStr);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleTimeConfirm = () => {
        let h = parseInt(hour);
        if (ampm === "PM" && h !== 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        const timeStr = `${String(h).padStart(2, "0")}:${minute}`;
        onConfirm(timeStr);
    };

    // Scroll Handler for Time Picker
    const handleScroll = (e: React.UIEvent<HTMLDivElement>, setter: (val: string) => void, items: string[]) => {
        const target = e.currentTarget;
        const itemHeight = 40;
        const index = Math.round(target.scrollTop / itemHeight);
        if (items[index]) {
            setter(items[index]);
        }
    };

    // Item Click Handler (Auto Scroll)
    const handleItemClick = (
        val: string,
        idx: number,
        setter: (val: string) => void,
        ref: React.RefObject<HTMLDivElement | null>
    ) => {
        setter(val);
        scrollToValue(ref, idx);
    };

    // Render Date Picker
    const renderDatePicker = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanks = Array.from({ length: firstDay }, (_, i) => i);

        const selectedDate = initialValue ? new Date(initialValue) : new Date();
        const isSelected = (day: number) =>
            initialValue &&
            selectedDate.getFullYear() === year &&
            selectedDate.getMonth() === month &&
            selectedDate.getDate() === day;

        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-4 px-2">
                    <button onClick={handlePrevMonth} className="text-gray-400 hover:text-white p-2">‹</button>
                    <span className="text-white font-bold text-lg">{year}년 {month + 1}월</span>
                    <button onClick={handleNextMonth} className="text-gray-400 hover:text-white p-2">›</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {["일", "월", "화", "수", "목", "금", "토"].map(d => (
                        <span key={d} className="text-xs text-gray-500 font-medium">{d}</span>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${isSelected(day)
                                    ? "bg-primary text-black font-bold shadow-lg shadow-primary/20"
                                    : "text-white hover:bg-white/10"}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // Render Time Picker (iOS Style Wheel)
    const renderTimePicker = () => {
        const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
        const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
        const ampms = ["AM", "PM"];

        // 렌더링 최적화를 위해 map 내부에서 함수 생성 최소화
        // (여기선 단순화를 위해 인라인)

        return (
            <div className="w-full flex flex-col items-center">

                {/* Wheel Container */}
                <div className="relative flex justify-center w-full h-[200px] overflow-hidden bg-surface-tertiary rounded-xl mb-6 mask-gradient select-none">

                    {/* Highlight Bar */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-10 bg-white/10 border-y border-white/20 pointer-events-none z-10" />

                    {/* AM/PM */}
                    <div
                        ref={ampmRef}
                        className="w-20 h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory py-[80px]"
                        onScroll={(e) => handleScroll(e, setAmpm, ampms)}
                    >
                        {ampms.map((val, idx) => (
                            <div
                                key={val}
                                onClick={() => handleItemClick(val, idx, setAmpm, ampmRef)}
                                className={`h-10 flex items-center justify-center snap-center text-lg font-bold transition-all cursor-pointer ${ampm === val ? "text-white opacity-100 scale-110" : "text-gray-500 opacity-60 scale-90"
                                    }`}
                            >
                                {val === "AM" ? "오전" : "오후"}
                            </div>
                        ))}
                    </div>

                    {/* Hour */}
                    <div
                        ref={hourRef}
                        className="w-20 h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory py-[80px]"
                        onScroll={(e) => handleScroll(e, setHour, hours)}
                    >
                        {hours.map((val, idx) => (
                            <div
                                key={val}
                                onClick={() => handleItemClick(val, idx, setHour, hourRef)}
                                className={`h-10 flex items-center justify-center snap-center text-xl font-bold transition-all cursor-pointer ${hour === val ? "text-white opacity-100 scale-110" : "text-gray-500 opacity-60 scale-90"
                                    }`}
                            >
                                {val}
                            </div>
                        ))}
                    </div>

                    <div className="pt-[80px] h-full flex items-center pb-[80px] text-white font-bold mb-1">:</div>

                    {/* Minute */}
                    <div
                        ref={minuteRef}
                        className="w-20 h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory py-[80px]"
                        onScroll={(e) => handleScroll(e, setMinute, minutes)}
                    >
                        {minutes.map((val, idx) => (
                            <div
                                key={val}
                                onClick={() => handleItemClick(val, idx, setMinute, minuteRef)}
                                className={`h-10 flex items-center justify-center snap-center text-xl font-bold transition-all cursor-pointer ${minute === val ? "text-white opacity-100 scale-110" : "text-gray-500 opacity-60 scale-90"
                                    }`}
                            >
                                {val}
                            </div>
                        ))}
                    </div>

                </div>

                <Button onClick={handleTimeConfirm} variant="primary" className="w-full py-3 text-sm rounded-xl">
                    확인
                </Button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center animate-fade-in">
            <div
                className="w-full max-w-sm bg-[#242424] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up sm:animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                        {type === "date" ? "날짜 선택" : "시간 선택"}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">✕</button>
                </div>

                {type === "date" ? renderDatePicker() : renderTimePicker()}
            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-gradient {
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }
      `}</style>
        </div>
    );
}

"use client";

import React from "react";

export default function AuthLinks() {
    return (
        <div className="flex items-center justify-center gap-4 mt-4 text-[13px] text-white/50">
            <button className="hover:text-white transition-colors">아이디찾기</button>
            <span className="w-[1px] h-3 bg-white/20"></span>
            <button className="hover:text-white transition-colors">비밀번호찾기</button>
            <span className="w-[1px] h-3 bg-white/20"></span>
            <button className="hover:text-white transition-colors">회원가입</button>
        </div>
    );
}

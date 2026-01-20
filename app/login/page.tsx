"use client";

import React, { useState } from "react";
import LoginLanding from "../components/login/LoginLanding";
import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        // Responsive Layout:
        // - Mobile: Full screen (no borders/rounding)
        // - PC: Full screen as well (removed phone frame styling)
        // - Unified dark theme for both
        <main className="w-full h-[100dvh] bg-black">

            {/* LANDING VIEW */}
            {!showForm && (
                <div className="w-full h-full bg-[#1E2414]">
                    <LoginLanding onEmailLoginClick={() => setShowForm(true)} />
                </div>
            )}

            {/* FORM VIEW */}
            {showForm && (
                <div className="w-full h-full bg-black animate-in fade-in slide-in-from-right-10 duration-300">
                    <LoginForm
                        onBack={() => setShowForm(false)}
                    />
                </div>
            )}
        </main>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

import LoginSupportLinks from "@/components/login/LoginSupportLinks";
import SocialButtons from "@/components/ui/SocialButtons";
import LoginLogo from "@/components/login/LoginLogo";

const LoginLanding = () => {
  const [showLanding, setShowLanding] = useState(true);



  return (
    <main className="flex flex-col h-full w-full justify-between items-center bg-linear-to-br from-primary-light via-dark-olive to-black relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 flex items-end justify-center">
        <div className="relative w-full h-[60%] opacity-50">
          <Image
            src="/images/bg_zlatan.webp"
            alt="Background"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-dark-olive/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/30" />
      </div>

      <LoginLogo />

      <div className="relative z-10 w-full p-6 pb-12 lg:pb-20 flex flex-col gap-2 max-w-sm mx-auto animate-in slide-in-from-bottom duration-500 fade-in delay-500">
        <SocialButtons />
        <Link href="/login">
          <Button variant="primary" size="xl" leftIcon={<Icon name="email" size={20} />}>
            이메일로 로그인
          </Button>
        </Link>
        <LoginSupportLinks />
      </div>

      {/* Intro Overlay */}
      {showLanding && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black">
          <video
            autoPlay
            muted
            playsInline
            className="w-full max-w-md md:max-w-3xl h-auto rounded-2xl shadow-2xl"
            onEnded={() => setShowLanding(false)}
          >
            <source src="/roding/roding.mov" type="video/quicktime" />
            <source src="/roding/roding.mov" type="video/mp4" />
          </video>
        </div>
      )}
    </main>
  );
};

export default LoginLanding;

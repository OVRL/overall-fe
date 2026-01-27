import Image from "next/image";
import { Button } from "@/components/ui/Button";

import LoginSupportLinks from "@/components/login/LoginSupportLinks";
import SocialButtons from "@/components/ui/SocialButtons";
import LoginLogo from "@/components/login/LoginLogo";
import Link from "next/link";

const LoginLanding = () => {
  return (
    <main className="flex flex-col h-full w-full justify-between items-center bg-linear-to-br from-primary-light via-dark-olive to-black relative overflow-hidden">
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

      <div className="relative z-10 w-full p-6 pb-12 lg:pb-20 flex flex-col gap-2 max-w-sm mx-auto animate-in slide-in-from-bottom duration-500 fade-in">
        <SocialButtons />
        <Link href="/login">
          <Button variant="primary" size="xl">
            이메일로 로그인
          </Button>
        </Link>
        <LoginSupportLinks />
      </div>
    </main>
  );
};

export default LoginLanding;

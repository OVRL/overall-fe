import logoOvr from "@/public/icons/logo_OVR.svg";
import Icon from "@/components/ui/Icon";
import Link from "next/link";

const Header = () => {
  return (
    <header className="border-b border-white/10 bg-black/10 backdrop-blur-[0.625rem] h-20.25 flex items-center justify-center">
      <nav className="px-6 py-4 flex justify-between w-full max-w-6xl">
        <Link
          href="/home"
          className="flex items-center"
          aria-label="홈으로 가기"
        >
          <Icon src={logoOvr} alt="OVR Logo" className="w-23 h-12" nofill />
        </Link>

        <Link
          href="/"
          className="w-23 h-10.5 border border-white/20 rounded-[0.625rem] bg-white/10 flex items-center justify-center text-white font-medium leading-6 text-center"
        >
          로그인
        </Link>
      </nav>
    </header>
  );
};

export default Header;

import logoOvr from "@/public/icons/logo_OVR.svg";
import Icon from "@/components/ui/Icon";
import Link from "@/components/Link";

const Header = () => {
  return (
    <header className="border-b border-white/10 bg-black/10 backdrop-blur-[0.625rem] h-20.25 flex items-center justify-center">
      <nav className="px-6 py-4 flex justify-between w-full max-w-6xl">
        <Link
          href="/"
          className="flex items-center"
          aria-label="홈으로 가기"
        >
          <Icon src={logoOvr} alt="OVR Logo" className="w-23 h-12" nofill />
        </Link>
        <Link
          href="/api/auth/logout?redirect=/login/social"
          prefetch={false}
          className="inline-flex items-center justify-center rounded-[0.625rem] border border-white/20 bg-white/10 px-6 py-2.25 text-sm font-medium text-white transition-[transform,background-color,border-color] duration-200 ease-out hover:border-white/40 hover:bg-white/15 motion-safe:hover:scale-[1.02] active:motion-safe:scale-[0.98] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="로그아웃"
        >
          로그아웃
        </Link>
      </nav>
    </header>
  );
};

export default Header;

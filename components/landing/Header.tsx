import logoOvr from "@/public/icons/logo_OVR.svg";
import Icon from "@/components/ui/Icon";
import Link from "@/components/Link";

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
      </nav>
    </header>
  );
};

export default Header;

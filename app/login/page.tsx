import EmailLoginForm from "@/components/login/EmailLoginForm";
import LoginLogo from "@/components/login/LoginLogo";
import Link from "@/components/Link";

const LoginPage = () => {
  return (
    <main className="flex flex-col h-full w-full bg-black text-white px-6 pb-6 pt-[max(1.5rem,env(safe-area-inset-top,0px))] lg:px-12 lg:pb-12 lg:pt-[max(5rem,env(safe-area-inset-top,0px))] relative">
      <LoginLogo />
      <EmailLoginForm />
      <p className="mt-6 text-center text-sm text-Label-Secondary">
        <Link
          href="/login/social"
          className="underline underline-offset-4 hover:text-Label-Primary"
        >
          소셜 계정으로 로그인
        </Link>
      </p>
    </main>
  );
};
export default LoginPage;

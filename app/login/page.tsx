import EmailLoginForm from "@/components/login/EmailLoginForm";
import LoginLogo from "@/components/login/LoginLogo";

const LoginPage = () => {
  return (
    <main className="flex flex-col h-full w-full bg-black text-white px-6 pb-6 pt-[max(1.5rem,env(safe-area-inset-top,0px))] lg:px-12 lg:pb-12 lg:pt-[max(5rem,env(safe-area-inset-top,0px))] relative">
      <LoginLogo />
      <EmailLoginForm />
    </main>
  );
};
export default LoginPage;

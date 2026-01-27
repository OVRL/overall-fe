import EmailLoginForm from "@/components/login/EmailLoginForm";
import LoginLogo from "@/components/login/LoginLogo";

const LoginPage = () => {
  return (
    <main className="flex flex-col h-full w-full bg-black text-white p-6 lg:p-12 lg:pt-20 relative">
      <LoginLogo />
      <EmailLoginForm />
    </main>
  );
};
export default LoginPage;

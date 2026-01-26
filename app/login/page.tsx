import EmailLoginForm from "@/components/login/EmailLoginForm";
import LoginHeader from "@/components/login/LoginHeader";

const LoginPage = () => {
  return (
    <main className="flex flex-col h-full w-full bg-black text-white p-6 lg:p-12 lg:pt-20 relative">
      <LoginHeader />
      <EmailLoginForm />
    </main>
  );
};
export default LoginPage;

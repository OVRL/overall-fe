import LogoAnimator from "./LogoAnimator";

export default function LoginLogo() {
  return (
    <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-8 ">
      <div className="mb-6">
        <LogoAnimator width={220} height={220} />
      </div>
    </div>
  );
}

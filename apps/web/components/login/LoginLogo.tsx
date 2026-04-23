import Image from "next/image";

export default function LoginLogo() {
  return (
    <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-8 ">
      <div className="mb-6">
        <Image
          src="/videos/login_logo.webp"
          alt="Overall 로고"
          width={220}
          height={220}
          unoptimized
          priority
          className="h-auto max-w-full"
        />
      </div>
    </div>
  );
}

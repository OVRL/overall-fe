import Image from "next/image";

export default function LoginLogo() {
  return (
    <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-8 ">
      <div className="mb-6 animate-in zoom-in duration-700">
        <Image
          src="/images/ovr.png"
          alt="OVR Logo"
          width={220}
          height={220}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  );
}

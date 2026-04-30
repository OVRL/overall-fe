import PrivacyConsentClient from "./_components/PrivacyConsentClient";

export default function PrivacyConsentPage() {
  return (
    <div className="flex flex-col gap-y-10 h-full pt-safe">
      <main className="flex min-h-0 flex-1 flex-col px-4 md:mx-auto md:max-w-layout md:px-0 w-full">
        <PrivacyConsentClient />
      </main>
    </div>
  );
}

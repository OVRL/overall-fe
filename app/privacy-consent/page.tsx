import PrivacyConsentClient from "./_components/PrivacyConsentClient";

export default function PrivacyConsentPage() {
  return (
    <div className="flex flex-col gap-y-10 h-full pt-safe">
      <main className="px-4 md:px-0 flex-1 md:max-w-layout md:mx-auto w-full min-h-0">
        <PrivacyConsentClient />
      </main>
    </div>
  );
}

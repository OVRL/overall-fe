import Header from "@/components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg-basic flex flex-col pt-safe">
      <Header variant="global" />
      {children}
    </div>
  );
}

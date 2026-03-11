import Header from "@/components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-basic flex flex-col">
      <Header variant="global" />
      {children}
    </div>
  );
}

import ProfileClientContainer from "./_components/ProfileClientContainer";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col py-6 md:py-8 px-4 lg:px-8">
      <div className="flex justify-center flex-1">
        <main className="max-w-300 min-w-0 flex-1 flex flex-col gap-6">
          <ProfileClientContainer />
        </main>
      </div>
    </div>
  );
}

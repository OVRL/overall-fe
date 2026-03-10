import { cookies } from "next/headers";
import CreateTeamWrapper from "./_components/CreateTeamWrapper";

const CreateTeamPage = async () => {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get("userId")?.value;
  const userId = userIdStr ? parseInt(userIdStr, 10) : 0;

  return (
    <div className="flex flex-col gap-y-10 h-full">
      <main className="px-4 md:px-0 flex-1 md:max-w-layout md:mx-auto w-full">
        <CreateTeamWrapper userId={userId} />
      </main>
    </div>
  );
};

export default CreateTeamPage;

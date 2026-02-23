import CreateTeamWrapper from "./_components/CreateTeamWrapper";

const CreateTeamPage = () => {
  return (
    <div className="flex flex-col gap-y-10 h-full">
      <main className="px-4 md:px-0 flex-1 md:max-w-layout md:mx-auto w-full">
        <CreateTeamWrapper />
      </main>
    </div>
  );
};

export default CreateTeamPage;

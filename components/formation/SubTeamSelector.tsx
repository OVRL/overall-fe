import React from "react";
import Button from "@/components/ui/Button";

interface SubTeamSelectorProps {
  selectedSubTeam?: "A" | "B";
  onSubTeamChange: (team: "A" | "B") => void;
}

const SubTeamSelector: React.FC<SubTeamSelectorProps> = ({
  selectedSubTeam,
  onSubTeamChange,
}) => {
  return (
    <div className="flex gap-2 items-center mr-2">
      <Button
        variant={selectedSubTeam === "A" ? "primary" : "ghost"}
        size="m"
        className="w-20"
        onClick={() => onSubTeamChange("A")}
      >
        A팀
      </Button>
      <Button
        variant={selectedSubTeam === "B" ? "primary" : "ghost"}
        size="m"
        className="w-20"
        onClick={() => onSubTeamChange("B")}
      >
        B팀
      </Button>
    </div>
  );
};

export default SubTeamSelector;

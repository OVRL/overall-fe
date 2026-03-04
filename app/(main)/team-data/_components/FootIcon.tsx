const FootIcon = ({ foot }: { foot: "L" | "R" | "B" }) => {
  const leftActive = foot === "L" || foot === "B";
  const rightActive = foot === "R" || foot === "B";

  const footLabel =
    foot === "L" ? "왼발잡이" : foot === "R" ? "오른발잡이" : "양발잡이";

  return (
    <div title={footLabel} className="flex items-center gap-0.5">
      {/* 왼발 */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 24 28"
        fill="none"
        className={leftActive ? "text-green-500" : "text-gray-600"}
      >
        <path
          d="M12 2C7 2 4 6 4 10C4 14 6 18 6 22C6 25 8 26 12 26C16 26 18 25 18 22C18 18 20 14 20 10C20 6 17 2 12 2Z"
          fill="currentColor"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fontSize="10"
          fill="black"
          fontWeight="bold"
        >
          L
        </text>
      </svg>
      {/* 오른발 */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 24 28"
        fill="none"
        className={rightActive ? "text-green-500" : "text-gray-600"}
      >
        <path
          d="M12 2C7 2 4 6 4 10C4 14 6 18 6 22C6 25 8 26 12 26C16 26 18 25 18 22C18 18 20 14 20 10C20 6 17 2 12 2Z"
          fill="currentColor"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fontSize="10"
          fill="black"
          fontWeight="bold"
        >
          R
        </text>
      </svg>
    </div>
  );
};

export default FootIcon;

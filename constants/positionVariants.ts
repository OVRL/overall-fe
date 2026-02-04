import { cva } from "class-variance-authority";

export const positionTextVariants = cva("", {
  variants: {
    intent: {
      FW: "text-Position-FW-Red",
      MF: "text-Position-MF-Green",
      DF: "text-Position-DF-Blue",
      GK: "text-Position-GK-Yellow",
    },
  },
  defaultVariants: {
    intent: "FW",
  },
});

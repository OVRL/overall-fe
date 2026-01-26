import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type Position =
  | 'FW' | 'MF' | 'DF' | 'GK'
  | 'ST' | 'CF' | 'RF' | 'LF' | 'RW' | 'LW' | 'RS' | 'LS'
  | 'CM' | 'LCM' | 'RCM' | 'CDM' | 'LDM' | 'RDM' | 'CAM' | 'LCAM' | 'RCAM' | 'RM' | 'LM' | 'RAM' | 'LAM'
  | 'CB' | 'LCB' | 'RCB' | 'LB' | 'RB' | 'LWB' | 'RWB' | 'SW';

export type MainPosition = 'FW' | 'MF' | 'DF' | 'GK';

export const POSITION_CATEGORY_MAP: Record<Position, MainPosition> = {
  ST: 'FW', CF: 'FW', RF: 'FW', LF: 'FW', RW: 'FW', LW: 'FW', RS: 'FW', LS: 'FW', FW: 'FW',
  CM: 'MF', LCM: 'MF', RCM: 'MF', CDM: 'MF', LDM: 'MF', RDM: 'MF', CAM: 'MF', LCAM: 'MF', RCAM: 'MF', RM: 'MF', LM: 'MF', RAM: 'MF', LAM: 'MF', MF: 'MF',
  CB: 'DF', LCB: 'DF', RCB: 'DF', LB: 'DF', RB: 'DF', LWB: 'DF', RWB: 'DF', SW: 'DF', DF: 'DF',
  GK: 'GK',
};

const positionChipVariants = cva(
  "py-1 px-1.5 inline-flex items-center justify-center rounded-sm text-xs font-semibold border shadow-[0_2px_10px_0_rgba(0,0,0,0.15)] transition-colors",
  {
    variants: {
      intent: {
        FW: "",
        MF: "",
        DF: "",
        GK: "",
      },
      variant: {
        outline: "bg-transparent",
        filled: "border-transparent",
      },
    },
    compoundVariants: [
      // Outline variants
      { intent: 'FW', variant: 'outline', className: 'border-Position-FW-Red text-Position-FW-Red' },
      { intent: 'MF', variant: 'outline', className: 'border-Position-MF-Green text-Position-MF-Green' },
      { intent: 'DF', variant: 'outline', className: 'border-Position-DF-Blue text-Position-DF-Blue' },
      { intent: 'GK', variant: 'outline', className: 'border-Position-GK-Yellow text-Position-GK-Yellow' },

      // Filled variants
      { intent: 'FW', variant: 'filled', className: 'bg-Position-FW-Red text-white' },
      { intent: 'MF', variant: 'filled', className: 'bg-Position-MF-Green text-white' },
      { intent: 'DF', variant: 'filled', className: 'bg-Position-DF-Blue text-white' },
      { intent: 'GK', variant: 'filled', className: 'bg-Position-GK-Yellow text-white' },
    ],
    defaultVariants: {
      variant: 'outline',
    }
  }
);

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  position: Position;
  variant?: 'outline' | 'filled';
}

const PositionChip = ({ position, variant = 'outline', className, ...props }: Props) => {
  const mainCategory = POSITION_CATEGORY_MAP[position];

  return (
    <span
      className={cn(positionChipVariants({ intent: mainCategory, variant }), className)}
      {...props}
    >
      {position}
    </span>
  );
};

export default PositionChip;
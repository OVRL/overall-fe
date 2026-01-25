import { Position, MainPosition } from '@/types/postion';
import PositionChip, { POSITION_CATEGORY_MAP } from '../PositionChip';
import Image from 'next/image';

type Props = {
    position: Position;
    backNumber:number;
    playerImage:string;
    name:string;
    ovr:number | null
}

const POSITION_GRADIENTS: Record<MainPosition, string> = {
    FW: 'linear-gradient(90deg, var(--color-Position-FW-Red) 0%, transparent 96.84%)',
    MF: 'linear-gradient(90deg, var(--color-Position-MF-Green) 0%, transparent 100%)',
    DF: 'linear-gradient(90deg, var(--color-Position-DF-Blue) 0%, transparent 100%)',
    GK: 'linear-gradient(90deg, var(--color-Position-GK-Yellow) 0%, color-mix(in srgb, var(--color-Position-GK-Yellow), transparent 80%) 100%)',
};

const PlayerListRow = ({position, backNumber, playerImage, name, ovr}: Props) => {
  const mainCategory = POSITION_CATEGORY_MAP[position];

  return (
    <tr className='flex justify-between items-center'>
        <td className='relative pl-2 flex items-center h-full w-22'>
            <div 
                className='absolute inset-0 opacity-10 pointer-events-none'
                style={{ background: POSITION_GRADIENTS[mainCategory] }}
            />
            <PositionChip position={position} />
            <span>{backNumber}</span>
        </td>
        <td className='flex gap-2 items-center justify-center'>
            <Image src={playerImage} alt={name} width={40} height={40} />
            <span>{name}</span>
        </td>
        <td className='w-12.5 text-center text-sm text-Label-AccentPrimary'>{ovr}</td>
    </tr>
  )
}

export default PlayerListRow 
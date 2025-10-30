import { Chip, Stack, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { Champion } from '../data/champions';

type Clue = { field: keyof Champion; value: string | number; status: 'correct'|'close'|'wrong'; direction?: 'older' | 'newer' | null };
export default function ClueRow({ clues, name }: { clues: Clue[]; name: string }) {
    const color = (s: Clue['status']) => s === 'correct' ? 'success' : s === 'close' ? 'warning' : 'error';

    const nameStatus = clues.find(c => c.field==='name')?.status ?? 'wrong';

    return (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={name} color={color(nameStatus)} variant="filled" sx={{ fontWeight: 600 }} />
            {clues.filter(c => c.field!=='name').map((c) => {
                const isYear = c.field === 'releaseYear';
                const showArrow = isYear && c.status !== 'correct' && c.direction;
                const icon = showArrow ? (c.direction === 'newer' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : undefined;
                const tooltip = isYear && showArrow ? (c.direction === 'newer' ? 'La bonne année est plus récente' : 'La bonne année est plus ancienne') : undefined;
                const chip = (
                    <Chip
                        key={String(c.field)}
                        label={String(c.value)}
                        color={color(c.status)}
                        variant="filled"
                        icon={icon}
                        sx={{ fontWeight: 600 }}
                    />
                );
                return tooltip ? <Tooltip key={String(c.field)} title={tooltip}>{chip}</Tooltip> : chip;
            })}
        </Stack>
    );
}

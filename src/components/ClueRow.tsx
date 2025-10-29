import { Chip, Stack } from '@mui/material';
import type { Champion } from '../data/champions';

type Clue = { field: keyof Champion; value: string | number; status: 'correct'|'close'|'wrong' };
export default function ClueRow({ clues, name }: { clues: Clue[]; name: string }) {
    const color = (s: Clue['status']) => s === 'correct' ? 'success' : s === 'close' ? 'warning' : 'default';
    return (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={name} color={clues.find(c => c.field==='name')?.status === 'correct' ? 'success' : 'default'} />
            {clues.filter(c => c.field!=='name').map((c) => (
                <Chip key={String(c.field)} label={`${c.field}: ${c.value}`} color={color(c.status)} variant="outlined" />
            ))}
        </Stack>
    );
}

import { useState } from 'react';
import { Autocomplete, TextField, Box, Button } from '@mui/material';
import { CHAMPIONS } from '../data/champions';
import { useGameStore } from '../store/useGameStore';

export default function GuessInput() {
    const [value, setValue] = useState<string>('');
    const tryGuess = useGameStore(s => s.tryGuess);

    const onSubmit = () => {
        const result = tryGuess(value);
        if (result === 'invalid') alert('Champion inconnu');
        setValue('');
    };

    return (
        <Box display="flex" gap={2}>
            <Autocomplete
                freeSolo
                options={CHAMPIONS.map(c => c.name)}
                value={value}
                onInputChange={(_, v) => setValue(v)}
                renderInput={(params) => <TextField {...params} label="Entre un champion" />}
                sx={{ flex: 1 }}
            />
            <Button variant="contained" onClick={onSubmit}>Valider</Button>
        </Box>
    );
}

import { useState, useMemo } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { useGameStore } from '../store/useGameStore';
import { CHAMPIONS } from '../data/championsData';

export default function GuessInput() {
  // inputValue controls the text in the input; selected controls the chosen option
  const [inputValue, setInputValue] = useState<string>('');
  const [selected, setSelected] = useState<string | null>(null);
  const tryGuess = useGameStore(s => s.tryGuess);
  const guesses = useGameStore(s => s.guesses);

  // Filter options to hide already-guessed champions
  const options = useMemo(() => {
    const guessed = new Set(guesses.map(g => g.raw.toLowerCase()));
    const locale = typeof navigator !== 'undefined'
      ? (navigator.languages?.[0] || navigator.language)
      : undefined;
    return CHAMPIONS.map(c => c.name)
      .filter(n => !guessed.has(n.toLowerCase()))
      .sort((a, b) => a.localeCompare(b, locale, { sensitivity: 'base' }));
  }, [guesses]);

  const submitGuess = (name: string) => {
    const result = tryGuess(name);
    if (result === 'invalid') alert('Champion inconnu');
    if (result === 'duplicate') alert('Champion déjà proposé');
    // Clear both the displayed text and the selected option
    setInputValue('');
    setSelected(null);
  };

  return (
    <Box display="flex" gap={2}>
      <Autocomplete
        freeSolo
        options={options}
        value={selected}
        inputValue={inputValue}
        onInputChange={(_, v) => setInputValue(v)}
        onChange={(_, v) => {
          if (v) submitGuess(v);
          else setSelected(null);
        }}
        renderInput={params => <TextField {...params} label="Entre un champion" />}
        sx={{ flex: 1 }}
      />
    </Box>
  );
}

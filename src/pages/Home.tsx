import { Container, Stack } from '@mui/material';
import GuessInput from '../components/GuessInput';
import GameBoard from '../components/GameBoard';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={2}>
        <GuessInput />
        <GameBoard />
      </Stack>
    </Container>
  );
}

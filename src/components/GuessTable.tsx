import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { Champion } from '../data/champions';

// Keep a local Clue type aligned with the store's shape
export type Clue = { field: keyof Champion; value: string | number; status: 'correct'|'close'|'wrong'; direction?: 'older' | 'newer' | null };
export type Guess = { raw: string; clues: Clue[] };

const columns: { key: keyof Champion | 'nameChip'; label: string }[] = [
  { key: 'nameChip', label: 'Nom' },
  { key: 'gender', label: 'Genre' },
  { key: 'roles', label: 'Rôles' },
  { key: 'species', label: 'Espèces' },
  { key: 'resource', label: 'Ressource' },
  { key: 'rangeType', label: 'Portée' },
  { key: 'regions', label: 'Régions' },
  { key: 'releaseYear', label: "Année" },
];

function colorFromStatus(s: Clue['status']) {
  return s === 'correct' ? 'success' : s === 'close' ? 'warning' : 'error';
}

function findClue(clues: Clue[], field: keyof Champion) {
  return clues.find(c => c.field === field);
}

export default function GuessTable({ guesses }: { guesses: Guess[] }) {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={String(col.key)} sx={{ fontWeight: 700 }}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {guesses.map((g, idx) => {
              const nameStatus = findClue(g.clues, 'name')?.status ?? 'wrong';
              const yearClue = findClue(g.clues, 'releaseYear');
              return (
                <TableRow key={idx} hover>
                  {/* Name chip */}
                  <TableCell>
                    <Chip label={g.raw} color={colorFromStatus(nameStatus)} variant="filled" sx={{ fontWeight: 600 }} />
                  </TableCell>

                  {/* Gender */}
                  <TableCell>
                    {(() => {
                      const c = findClue(g.clues, 'gender');
                      return c ? (
                        <Chip label={String(c.value)} color={colorFromStatus(c.status)} variant="filled" sx={{ fontWeight: 600 }} />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Roles */}
                  <TableCell>
                    {(() => {
                      const c = findClue(g.clues, 'roles');
                      return c ? (
                        <Chip label={String(c.value)} color={colorFromStatus(c.status)} variant="filled" sx={{ fontWeight: 600 }} />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Species */}
                  <TableCell>
                    {(() => {
                      const c = findClue(g.clues, 'species');
                      return c ? (
                        <Chip label={String(c.value)} color={colorFromStatus(c.status)} variant="filled" sx={{ fontWeight: 600 }} />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Resource */}
                  <TableCell>
                    {(() => {
                      const c = findClue(g.clues, 'resource');
                      return c ? (
                        <Chip label={String(c.value)} color={colorFromStatus(c.status)} variant="filled" sx={{ fontWeight: 600 }} />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* RangeType */}
                  <TableCell>
                    {(() => {
                      const c = findClue(g.clues, 'rangeType');
                      return c ? (
                        <Chip label={String(c.value)} color={colorFromStatus(c.status)} variant="filled" sx={{ fontWeight: 600 }} />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Regions */}
                  <TableCell>
                    {(() => {
                      const c = findClue(g.clues, 'regions');
                      return c ? (
                        <Chip label={String(c.value)} color={colorFromStatus(c.status)} variant="filled" sx={{ fontWeight: 600 }} />
                      ) : null;
                    })()}
                  </TableCell>

                  {/* Release Year with arrow/tooltip when needed */}
                  <TableCell>
                    {yearClue ? (() => {
                      const isExact = yearClue.status === 'correct';
                      const showArrow = !isExact && yearClue.direction;
                      const icon = showArrow ? (yearClue.direction === 'newer' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />) : undefined;
                      const chip = (
                        <Chip
                          label={String(yearClue.value)}
                          color={colorFromStatus(yearClue.status)}
                          variant="filled"
                          icon={icon}
                          sx={{ fontWeight: 600 }}
                        />
                      );
                      const tooltip = showArrow ? (yearClue.direction === 'newer' ? 'La bonne année est plus récente' : 'La bonne année est plus ancienne') : undefined;
                      return tooltip ? <Tooltip title={tooltip}>{chip}</Tooltip> : chip;
                    })() : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

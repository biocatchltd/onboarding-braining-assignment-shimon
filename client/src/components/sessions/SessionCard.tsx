import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { sessionStore } from '../../stores/sessionStore';
import type { Session } from '../../types/session';

/** Number of characters to show for truncated IDs */
const ID_DISPLAY_LENGTH = 8;

interface SessionCardProps {
  /** Session data to display */
  session: Session;
}

/**
 * Compact card view of a session for mobile layouts.
 * Displays session ID, device type, transfer amount, and fraud status.
 * Clicking opens the edit dialog.
 */
export const SessionCard = observer(({ session }: SessionCardProps) => {
  const truncatedSessionId = session.id.slice(0, ID_DISPLAY_LENGTH);
  const fraudChipColor = session.fraud ? 'error' : 'success';
  const fraudChipLabel = session.fraud ? 'Yes' : 'No';

  return (
    <Card
      variant="outlined"
      sx={{ mb: 1.5, cursor: 'pointer' }}
      onClick={() => sessionStore.openEdit(session)}
    >
      <CardContent sx={{ '&:last-child': { pb: 1.5 }, py: 1.5 }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography variant="caption" className="font-mono" color="text.secondary">
              {truncatedSessionId}…
            </Typography>
            <Chip label={session.device_type} size="small" />
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2">Transfer</Typography>
            <Typography variant="body2" fontWeight={500}>
              ${session.transfer_usd.toFixed(2)}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={0.5}>
            <Chip label={fraudChipLabel} size="small" color={fraudChipColor} variant="filled" />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
});

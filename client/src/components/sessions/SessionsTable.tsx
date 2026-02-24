import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useSessions } from '../../hooks/useSessions';
import { sessionStore } from '../../stores/sessionStore';
import { SessionCard } from './SessionCard';
import { SessionsPagination } from './SessionsPagination';
import { TableLoader } from '../common/TableLoader';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';

/**
 * Sessions table with responsive layout.
 * Shows cards on mobile, table on desktop.
 * Handles loading, error, and empty states.
 */
export const SessionsTable = observer(() => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const { sessions, query } = useSessions();

  if (query.isLoading) {
    return <TableLoader />;
  }

  if (query.isError) {
    const errorMessage = (query.error as Error).message;
    return <ErrorState message={errorMessage} onRetry={() => query.refetch()} />;
  }

  if (sessions.length === 0) {
    return <EmptyState />;
  }

  const handleRowClick = (session: (typeof sessions)[number]) => () => {
    sessionStore.openEdit(session);
  };

  return (
    <Box>
      {isMobileView ? (
        <Box sx={{ mb: 2 }}>
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          className="shadow"
          sx={{
            overflowX: 'auto',
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow className="bg-slate-100">
                <TableCell>ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Device</TableCell>
                <TableCell align="right">Transfer (USD)</TableCell>
                <TableCell>Fraud</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow
                  key={session.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={handleRowClick(session)}
                >
                  <TableCell className="font-mono text-xs">{session.id}</TableCell>
                  <TableCell className="font-mono text-xs">{session.multi_user_id}</TableCell>
                  <TableCell>
                    <Chip label={session.device_type} size="small" />
                  </TableCell>
                  <TableCell align="right">${session.transfer_usd.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={session.fraud ? 'Yes' : 'No'}
                      size="small"
                      color={session.fraud ? 'error' : 'success'}
                      variant="filled"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <SessionsPagination />
    </Box>
  );
});

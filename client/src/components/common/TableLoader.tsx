import { Box, CircularProgress, Typography } from '@mui/material';

/** Loading message shown while fetching sessions */
const LOADING_MESSAGE = 'Loading sessions…';

/**
 * Loading state for the sessions table.
 * Shows a spinner and message while data is being fetched.
 */
export const TableLoader = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      gap: 2,
    }}
  >
    <CircularProgress />
    <Typography variant="body2" color="text.secondary">
      {LOADING_MESSAGE}
    </Typography>
  </Box>
);

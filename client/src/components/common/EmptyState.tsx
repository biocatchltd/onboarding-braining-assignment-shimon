import { Box, Typography } from '@mui/material';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

/** Message shown when there are no sessions */
const EMPTY_TITLE = 'No sessions yet';
const EMPTY_SUBTITLE = 'Create a new session to get started';

/**
 * Empty state for the sessions table.
 * Shown when the list is loaded but has no items.
 */
export const EmptyState = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      gap: 1,
    }}
  >
    <FolderOpenOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
    <Typography variant="body1" color="text.secondary">
      {EMPTY_TITLE}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {EMPTY_SUBTITLE}
    </Typography>
  </Box>
);

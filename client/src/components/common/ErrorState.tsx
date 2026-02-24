import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorStateProps {
  /** Error message to display */
  message: string;
  /** Optional retry callback; if provided, shows a Retry button */
  onRetry?: () => void;
}

/**
 * Error state for the sessions table.
 * Shown when the fetch fails, with optional retry action.
 */
export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
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
    <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
    <Typography variant="body1" color="error">
      {message}
    </Typography>
    {onRetry && (
      <Button variant="outlined" onClick={onRetry}>
        Retry
      </Button>
    )}
  </Box>
);

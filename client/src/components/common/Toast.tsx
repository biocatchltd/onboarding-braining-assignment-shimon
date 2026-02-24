import { Snackbar, Alert } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { toastStore } from '../../stores/toastStore';

/** Duration in ms before toast auto-hides */
const AUTO_HIDE_DURATION_MS = 4000;

/**
 * Global toast notification component.
 * Renders at bottom-center and displays success/error/info messages.
 */
export const Toast = observer(() => (
  <Snackbar
    open={toastStore.open}
    autoHideDuration={AUTO_HIDE_DURATION_MS}
    onClose={() => toastStore.close()}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert
      onClose={() => toastStore.close()}
      severity={toastStore.severity}
      variant="filled"
      sx={{ width: '100%' }}
    >
      {toastStore.message}
    </Alert>
  </Snackbar>
));

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useSessions } from '../../hooks/useSessions';
import { sessionStore } from '../../stores/sessionStore';

/**
 * Confirmation dialog for soft-deleting a session.
 * Opens when user clicks Delete in the edit dialog.
 */
export const DeleteSessionDialog = observer(() => {
  const { deleteSession, deleteMutation } = useSessions();
  const sessionIdToDelete = sessionStore.deleteSessionId;

  const handleClose = () => {
    sessionStore.closeDeleteConfirm();
  };

  const handleConfirm = () => {
    if (sessionIdToDelete) {
      deleteSession(sessionIdToDelete);
    }
    handleClose();
  };

  return (
    <Dialog open={!!sessionIdToDelete} onClose={handleClose}>
      <DialogTitle>Delete session</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this session?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={deleteMutation.isPending}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
});

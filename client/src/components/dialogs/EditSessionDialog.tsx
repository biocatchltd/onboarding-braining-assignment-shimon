import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { observer } from 'mobx-react-lite';
import { useQuery } from '@tanstack/react-query';
import {
  SessionFormFields,
  validateTransferUsd,
} from '../sessions/SessionFormFields';
import { sessionsApi } from '../../api/sessions';
import { useSessions } from '../../hooks/useSessions';
import { sessionStore } from '../../stores/sessionStore';
import type { SessionUpdate, Device } from '../../types/session';

/**
 * Dialog for editing an existing session.
 * Fetches session data by ID and syncs form state when session loads.
 */
export const EditSessionDialog = observer(() => {
  const theme = useTheme();
  const isFullScreenOnMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { updateSession, updateMutation } = useSessions();
  const sessionIdToEdit = sessionStore.editId;

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionIdToEdit],
    queryFn: () => sessionsApi.get(sessionIdToEdit!),
    enabled: !!sessionIdToEdit,
  });

  const [deviceType, setDeviceType] = useState<Device>('pc');
  const [transferUsd, setTransferUsd] = useState('');
  const [isFraud, setIsFraud] = useState(false);
  const [isTransferUsdTouched, setIsTransferUsdTouched] = useState(false);

  // Sync form state when session loads or when switching sessions
  useEffect(() => {
    if (!sessionIdToEdit) {
      setDeviceType('pc');
      setTransferUsd('');
      setIsFraud(false);
      setIsTransferUsdTouched(false);
      return;
    }
    if (session) {
      setDeviceType(session.device_type);
      setTransferUsd(String(session.transfer_usd));
      setIsFraud(Boolean(session.fraud));
      setIsTransferUsdTouched(false);
    } else {
      setDeviceType('pc');
      setTransferUsd('');
      setIsFraud(false);
    }
  }, [sessionIdToEdit, session]);

  const transferUsdError = isTransferUsdTouched
    ? validateTransferUsd(transferUsd, false)
    : null;
  const transferAmountUsd = parseFloat(transferUsd);
  const isFormValid = !validateTransferUsd(transferUsd, false);

  /** True if any field differs from the loaded session */
  const isFormDirty =
    session &&
    (deviceType !== session.device_type ||
      transferAmountUsd !== session.transfer_usd ||
      isFraud !== Boolean(session.fraud));

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setIsTransferUsdTouched(true);
      if (!isFormValid || !sessionIdToEdit) return;

      const updatePayload: SessionUpdate = {
        device_type: deviceType,
        fraud: isFraud,
      };
      if (!Number.isNaN(transferAmountUsd) && transferAmountUsd > 0) {
        updatePayload.transfer_usd = transferAmountUsd;
      }
      updateSession(sessionIdToEdit, updatePayload);
    },
    [
      isFormValid,
      deviceType,
      transferUsd,
      isFraud,
      transferAmountUsd,
      sessionIdToEdit,
      updateSession,
    ]
  );

  const handleDeleteClick = () => {
    if (sessionIdToEdit) sessionStore.openDeleteConfirm(sessionIdToEdit);
  };

  return (
    <Dialog
      open={!!sessionIdToEdit}
      onClose={() => sessionStore.closeEdit()}
      maxWidth="sm"
      fullWidth
      fullScreen={isFullScreenOnMobile}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit session</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <Typography>Loading…</Typography>
          ) : (
            <SessionFormFields
              mode="edit"
              multiUserId=""
              onMultiUserIdChange={() => {}}
              multiUserIdError={null}
              deviceType={deviceType}
              onDeviceTypeChange={setDeviceType}
              transferUsd={transferUsd}
              onTransferUsdChange={(value) => {
                setTransferUsd(value);
                setIsTransferUsdTouched(true);
              }}
              transferUsdError={transferUsdError}
              fraud={isFraud}
              onFraudChange={setIsFraud}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button
            color="error"
            onClick={handleDeleteClick}
            disabled={updateMutation.isPending || isLoading}
          >
            <DeleteIcon />
          </Button>
          <Box>
            <Button onClick={() => sessionStore.closeEdit()}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                updateMutation.isPending ||
                isLoading ||
                !isFormValid ||
                !isFormDirty
              }
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
});

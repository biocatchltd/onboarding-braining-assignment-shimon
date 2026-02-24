import { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import {
  SessionFormFields,
  validateMultiUserId,
  validateTransferUsd,
} from '../sessions/SessionFormFields';
import { useSessions } from '../../hooks/useSessions';
import { sessionStore } from '../../stores/sessionStore';
import type { Device } from '../../types/session';

/** Tracks which fields have been touched for validation */
interface TouchedFields {
  multiUserId: boolean;
  transferUsd: boolean;
}

const INITIAL_TOUCHED: TouchedFields = {
  multiUserId: false,
  transferUsd: false,
};

/**
 * Dialog for creating a new session.
 * Resets form when closed and validates on submit.
 */
export const CreateSessionDialog = observer(() => {
  const theme = useTheme();
  const isFullScreenOnMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { createSession, createMutation } = useSessions();

  const [multiUserId, setMultiUserId] = useState('');
  const [deviceType, setDeviceType] = useState<Device>('pc');
  const [transferUsd, setTransferUsd] = useState('');
  const [isFraud, setIsFraud] = useState(false);
  const [touchedFields, setTouchedFields] = useState<TouchedFields>(INITIAL_TOUCHED);

  const multiUserIdError = touchedFields.multiUserId ? validateMultiUserId(multiUserId) : null;
  const transferUsdError = touchedFields.transferUsd ? validateTransferUsd(transferUsd) : null;
  const isFormValid =
    !validateMultiUserId(multiUserId) && !validateTransferUsd(transferUsd);

  const resetForm = useCallback(() => {
    setMultiUserId('');
    setTransferUsd('');
    setIsFraud(false);
    setDeviceType('pc');
    setTouchedFields(INITIAL_TOUCHED);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setTouchedFields({ multiUserId: true, transferUsd: true });
      if (!isFormValid) return;

      const transferAmountUsd = parseFloat(transferUsd);
      createSession({
        multi_user_id: multiUserId.trim(),
        device_type: deviceType,
        transfer_usd: transferAmountUsd,
        fraud: isFraud,
      });
    },
    [isFormValid, multiUserId, deviceType, transferUsd, isFraud, createSession]
  );

  const handleClose = useCallback(() => {
    resetForm();
    sessionStore.closeCreate();
  }, [resetForm]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!sessionStore.createOpen) resetForm();
  }, [sessionStore.createOpen, resetForm]);

  return (
    <Dialog
      open={sessionStore.createOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isFullScreenOnMobile}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Session</DialogTitle>
        <DialogContent>
          <SessionFormFields
            mode="create"
            multiUserId={multiUserId}
            onMultiUserIdChange={(value) => {
              setMultiUserId(value);
              setTouchedFields((prev) => ({ ...prev, multiUserId: true }));
            }}
            multiUserIdError={multiUserIdError}
            deviceType={deviceType}
            onDeviceTypeChange={setDeviceType}
            transferUsd={transferUsd}
            onTransferUsdChange={(value) => {
              setTransferUsd(value);
              setTouchedFields((prev) => ({ ...prev, transferUsd: true }));
            }}
            transferUsdError={transferUsdError}
            fraud={isFraud}
            onFraudChange={setIsFraud}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending || !isFormValid}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

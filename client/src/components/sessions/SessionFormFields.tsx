import {
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Stack,
} from '@mui/material';
import { DEVICE_OPTIONS } from '../../constants/device';
import {
  validateMultiUserId,
  validateTransferUsd,
} from '../../utils/validation';
import type { Device } from '../../types/session';

export { validateMultiUserId, validateTransferUsd };

/** Form mode: create shows multi-user ID field, edit hides it */
type FormMode = 'create' | 'edit';

interface SessionFormFieldsProps {
  /** Whether form is for creating or editing a session */
  mode: FormMode;
  /** Multi-user UUID value */
  multiUserId: string;
  /** Callback when multi-user ID changes */
  onMultiUserIdChange: (value: string) => void;
  /** Validation error for multi-user ID, or null if valid */
  multiUserIdError: string | null;
  /** Selected device type */
  deviceType: Device;
  /** Callback when device type changes */
  onDeviceTypeChange: (value: Device) => void;
  /** Transfer amount in USD (string for controlled input) */
  transferUsd: string;
  /** Callback when transfer USD changes */
  onTransferUsdChange: (value: string) => void;
  /** Validation error for transfer USD, or null if valid */
  transferUsdError: string | null;
  /** Whether session is marked as fraud */
  fraud: boolean;
  /** Callback when fraud checkbox changes */
  onFraudChange: (value: boolean) => void;
}

/**
 * Reusable form fields for creating or editing a session.
 * Includes multi-user ID (create only), device type, transfer USD, and fraud checkbox.
 */
export const SessionFormFields = ({
  mode,
  multiUserId,
  onMultiUserIdChange,
  multiUserIdError,
  deviceType,
  onDeviceTypeChange,
  transferUsd,
  onTransferUsdChange,
  transferUsdError,
  fraud,
  onFraudChange,
}: SessionFormFieldsProps) => (
  <Stack spacing={2} sx={{ pt: 1 }}>
    {mode === 'create' && (
      <TextField
        label="Multi user ID (UUID)"
        value={multiUserId}
        onChange={(event) => onMultiUserIdChange(event.target.value)}
        error={!!multiUserIdError}
        helperText={multiUserIdError}
        placeholder="550e8400-e29b-41d4-a716-446655440000"
        fullWidth
        required
      />
    )}
    <TextField
      select
      label="Device"
      value={deviceType}
      onChange={(event) => onDeviceTypeChange(event.target.value as Device)}
      fullWidth
    >
      {DEVICE_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
    <TextField
      type="number"
      label="Transfer USD"
      value={transferUsd}
      onChange={(event) => onTransferUsdChange(event.target.value)}
      error={!!transferUsdError}
      helperText={transferUsdError}
      slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
      fullWidth
      required={mode === 'create'}
    />
    <FormControlLabel
      control={
        <Checkbox checked={fraud} onChange={(event) => onFraudChange(event.target.checked)} />
      }
      label="Fraud"
    />
  </Stack>
);

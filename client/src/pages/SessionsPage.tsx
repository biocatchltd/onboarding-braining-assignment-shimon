import { Box, Button, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { sessionStore } from '../stores/sessionStore';
import { SessionsTable } from '../components/sessions/SessionsTable';
import { CreateSessionDialog } from '../components/dialogs/CreateSessionDialog';
import { EditSessionDialog } from '../components/dialogs/EditSessionDialog';
import { DeleteSessionDialog } from '../components/dialogs/DeleteSessionDialog';
import { Toast } from '../components/common/Toast';

/**
 * Main sessions page.
 * Displays sessions table, footer with Add Session button, and all session dialogs.
 */
const SessionsPage = observer(() => (
  <Box
    className="min-h-screen bg-slate-50"
    sx={{
      p: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Typography
      variant="h4"
      sx={{ mb: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}
    >
      Sessions
    </Typography>

    <Box sx={{ flex: 1 }}>
      <SessionsTable />
    </Box>

    <Box
      component="footer"
      sx={{
        mt: 'auto',
        pt: 2,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Button variant="contained" onClick={() => sessionStore.openCreate()}>
        Add Session
      </Button>
    </Box>

    <CreateSessionDialog />
    <EditSessionDialog />
    <DeleteSessionDialog />
    <Toast />
  </Box>
));

export default SessionsPage;

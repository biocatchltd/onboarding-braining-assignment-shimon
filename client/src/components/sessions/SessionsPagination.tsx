import { Paper, TablePagination, useMediaQuery, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useSessions } from '../../hooks/useSessions';
import { sessionStore } from '../../stores/sessionStore';

/**
 * Pagination controls for the sessions table.
 * Hidden when there are no sessions or only one page of results.
 */
export const SessionsPagination = observer(() => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const { total } = useSessions();
  const currentPage = sessionStore.page;
  const rowsPerPage = sessionStore.rowsPerPage;

  /** Hide pagination when empty or when all results fit on one page */
  const shouldShowPagination = total > 0 && total > rowsPerPage;
  if (!shouldShowPagination) return null;

  const handlePageChange = (_: unknown, newPage: number) => {
    sessionStore.setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = Number(event.target.value);
    sessionStore.setRowsPerPage(newRowsPerPage);
    sessionStore.setPage(0);
  };

  return (
    <Paper variant="outlined" sx={{ p: 1, mt: isMobileView ? 0 : 2 }}>
      <TablePagination
        component="div"
        count={total}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={isMobileView ? [10, 20] : [10, 20, 50]}
        labelRowsPerPage={isMobileView ? '' : 'Rows per page:'}
        labelDisplayedRows={({ from, to, count }) =>
          isMobileView ? `${from}-${to}` : `${from}-${to} of ${count}`}
        showFirstButton={!isMobileView}
        showLastButton={!isMobileView}
        sx={{
          flexWrap: 'wrap',
          overflow: 'visible',
          border: 'none',
          '.MuiTablePagination-toolbar': { flexWrap: 'wrap', gap: 1, minHeight: 48 },
        }}
      />
    </Paper>
  );
});

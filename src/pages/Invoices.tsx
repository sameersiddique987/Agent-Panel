import { Box, Button } from "@mui/material";
import Header from "../components/ui/Header";
import InvoicesTable from "../components/tables/InvoicesTable";
import { Link as RouterLink } from "react-router-dom";

const InvoicesPage = () => {
  return (
    <Box >
      <Header title="Invoices" description="List of Invoice Balances" />
      <Button
        component={RouterLink}
        to="/createinvoice"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Create Invoice
      </Button>
      <InvoicesTable />
    </Box>
  );
}

export default InvoicesPage
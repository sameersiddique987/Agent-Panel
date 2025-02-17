import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  phone: string;
  airline: string;
  flightNumber: string;
  flightClass: string;
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  seatNumber: string;
  price: number;
}

const CreateInvoice: React.FC = () => {
  const { handleSubmit, control } = useForm<FormData>();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices/all');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const generatePDF = async (formData: FormData): Promise<void> => {
    try {
      const doc = new jsPDF();

      // Add a heading
      doc.setFontSize(15);
      doc.text("THE GRAND TRAVEL", 105, 15, { align: "center" });


      // Add a horizontal line
      doc.setLineWidth(0.5);
      doc.line(20, 20, 190, 20);

      // Add the table with form data
      autoTable(doc, {
        startY: 25,
        head: [["Field", "Details"]],
        body: [
          ["Name", formData.name],
          ["Email", formData.email],
          ["Phone", formData.phone],
          ["Departure", formData.departure],
          ["Destination", formData.destination],
          ["Date", formData.date],
          ["Seat Number", formData.seatNumber],
          ["Price", `$${Number(formData.price).toFixed(2)}`],
        ],
        theme: "grid",
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 12, cellPadding: 2 },
      });

      // Ensure `finalY` exists before using it
      const finalY = (doc as any).lastAutoTable.finalY || 60;

      // Add another table for flight details
      autoTable(doc, {
        startY: finalY + 5,
        head: [
          ["Airline", "Flight No", "Class", "From", "To", "Dept Time", "Arr Time", "Status"],
        ],
        body: [
          [formData.airline, formData.flightNumber, formData.flightClass, formData.departure, formData.destination, formData.departureTime, formData.arrivalTime, "Confirmed"],
        ],
        theme: "grid",
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 12, cellPadding: 2 },
      });

      const lastY = (doc as any).lastAutoTable.finalY || finalY + 15;

      // Add a note
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const noteText = doc.splitTextToSize(
        "Your Financial Protection: When you buy an ATOL protected flight or flight inclusive holiday from us you will receive an ATOL Certificate. This lists what is financially protected, where you can get information on what this means for you and who to contact if things go wrong.",
        170
      );
      doc.text(noteText, 105, lastY + 5, { align: "center" });

      // Add a footer
      doc.setLineWidth(0.5);
      doc.line(20, lastY + 15, 190, lastY + 15);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      const footerText = doc.splitTextToSize(
        "The Grand Travel | Address: 1352 Leeds Road, Bradford, BD3 8ND, Tel: 01274 271818 | 01274665809, Emails: grandtravel786@gmail.com | Grand world travel | Address: 64 Leeds Old Road, Bradford, BD3 8HX | Tel: 01274661777, 01274015013",
        170
      );
      doc.text(footerText, 105, lastY + 20, { align: "center" });

      // Save PDF
      const pdfBlob = doc.output('blob');
      const formDataToUpload = new FormData();
      formDataToUpload.append('invoice', pdfBlob, 'invoice.pdf');

      // Upload PDF to server
      const response = await axios.post('http://localhost:5000/upload-invoice', formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Invoice uploaded:', response.data.invoiceUrl);
      doc.save("invoice.pdf");

      // Fetch updated invoices list
      fetchInvoices();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const onSubmit = (formData: FormData) => {
    generatePDF(formData);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create Invoice
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Name" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Email" type="email" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="phone"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Phone" type="tel" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="airline"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Airline" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="flightNumber"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Flight Number" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="flightClass"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Class" select fullWidth margin="normal" required>
              <MenuItem value="Economy">Economy</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="First Class">First Class</MenuItem>
            </TextField>
          )}
        />
        <Controller
          name="departure"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="From" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="destination"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="To" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="departureTime"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Departure Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
          )}
        />
        <Controller
          name="arrivalTime"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Arrival Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
          )}
        />
        <Controller
          name="date"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
          )}
        />
        <Controller
          name="seatNumber"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Seat Number" fullWidth margin="normal" required />
          )}
        />
        <Controller
          name="price"
          control={control}
          defaultValue={0}
          render={({ field }) => (
            <TextField {...field} label="Price" type="number" fullWidth margin="normal" required />
          )}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Create Invoice
        </Button>
      </form>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Invoices
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.name}</TableCell>
                <TableCell>{invoice.email}</TableCell>
                <TableCell>{invoice.phone}</TableCell>
                <TableCell>{invoice.departure}</TableCell>
                <TableCell>{invoice.destination}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>${invoice.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CreateInvoice;
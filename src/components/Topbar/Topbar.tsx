"use client"
import React from 'react'
import { Alert, IconButton, Snackbar, Stack } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { addIconButton, amtTextField, buttonStyle, CustomFormControl, CustomFormControlRadio, style, title, topbarStack } from './styles';
import { Box, Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Slide, { SlideProps } from '@mui/material/Slide';

function SlideTransition(props: React.JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="up" />;
}

interface AddTransactionProps {
  onTransactionAdded: () => void;
}

const Topbar: React.FC<AddTransactionProps> = ({ onTransactionAdded }) => {
  const [open, setOpen] = React.useState(false);
  const [category, setCategory] = React.useState('');
  const [salCat, setSalCat] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [amount, setAmount] = React.useState<number | string>(0);
  const [splitAmount, setSplitAmount] = React.useState<number | string>(0);
  const [message, setMessage] = React.useState('');
  const [transactionType, setTransactionType] = React.useState<'Income' | 'Expense'>('Expense');

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarType, setSnackbarType] = React.useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetStates();
    setOpen(false);
  };
  const resetStates = () => {
    setCategory('');
    setSalCat('');
    setPaymentMethod('');
    setAmount(0);
    setMessage('');
    setTransactionType('Expense');
  };
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  const handlePaymentChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value as string);
  };
  const handleSalaryChange = (event: SelectChangeEvent) => {
    setSalCat(event.target.value as string);
  };
  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionType(event.target.value as 'Income' | 'Expense');
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmount(value === '' ? '' : parseFloat(value));
  };

  const handleSplitAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSplitAmount(value === '' ? '' : parseFloat(value));
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };
  const categories = [
    'Entertainment & Leisure',
    'Food & Beverages',
    'Health & Personal Care',
    'Investments',
    'Miscellaneous',
    'Shopping',
    'Transportation',
    'Travel',
    'Utilities & Bills'
  ]
  const modeOfPayment = ['Cash', 'Credit Card', 'UPI']
  const salaryCat = [
    'Investments',
    'Needs',
    'Parents Fund',
    'Trips',
    'Wants'
  ]

  const getFormattedDate = (dateTime: Date): string => {
    return `${dateTime.getMonth() + 1}/${dateTime.getDate()}/${dateTime.getFullYear()}`;
  };
  const handleAddTransaction = async () => {
    const parsedAmount = parseFloat(amount as string) || 0;
    const parsedSplitAmount = parseFloat(splitAmount as string) || 0;

    console.log('Amount (before parsing):', amount);
    console.log('Split Amount (before parsing):', splitAmount);
    console.log('Parsed Amount:', parsedAmount);
    console.log('Parsed Split Amount:', parsedSplitAmount);
    console.log('Parsed Effective Amount:', parsedAmount - parsedSplitAmount);

    const transaction = {
      "Amount": parsedAmount,
      "Expense/Income": transactionType,
      "Date": getFormattedDate(new Date()),
      "ModeOfPayment": paymentMethod,
      "Category": category,
      "Message": message,
      "SalaryBifercationCat": salCat,
      "Minus": parsedSplitAmount,
      "Effective": (parsedAmount - parsedSplitAmount)
    };

    console.log('Transaction Object:', transaction);
    console.log('Effective Amount:', transaction.Effective);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    console.log(apiUrl);
    try {
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(transaction)
      })
        .then(response => {

          handleClose();
          if (!response.ok) {
            setSnackbarMessage('New Transaction Added Successfully');
            setSnackbarType('success');
            setSnackbarOpen(true);
            onTransactionAdded();
          }
          onTransactionAdded();
        })
        .then(data => console.log(data))
        .catch(error => {
          handleClose();
          setSnackbarMessage(`Error: ${error}`);
          setSnackbarType('error');
          setSnackbarOpen(true);
        })
    } catch (error) {
      handleClose();
      setSnackbarMessage(`Error: ${error}`);
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      <Stack direction="row" sx={topbarStack}>
        <Typography variant="h4" sx={title}>Kush&apos;s Expense Tracker Dashboard</Typography>
        <IconButton aria-label="add" sx={addIconButton} onClick={handleOpen}>
          <AddCircleIcon />
        </IconButton>
      </Stack>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            <CustomFormControlRadio>
              <FormLabel component="legend">Income or Expense</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={transactionType}
                onChange={handleTransactionTypeChange}
              >
                <FormControlLabel value="Income" control={<Radio />} label="Income" />
                <FormControlLabel value="Expense" control={<Radio />} label="Expense" />
              </RadioGroup>
            </CustomFormControlRadio>

            <CustomFormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={category}
                label="Select Category"
                onChange={handleCategoryChange}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </CustomFormControl>

            <CustomFormControl fullWidth>
              <InputLabel>Mode Of Payment</InputLabel>
              <Select
                value={paymentMethod}
                label="Mode Of Payment"
                onChange={handlePaymentChange}
              >
                {modeOfPayment.map((pay, index) => (
                  <MenuItem key={index} value={pay}>
                    {pay}
                  </MenuItem>
                ))}
              </Select>
            </CustomFormControl>

            <TextField
              sx={amtTextField}
              name="amount"
              fullWidth
              label={<Typography variant="body1" color='#fff'>Amount</Typography>}
              value={amount === 0 ? '' : amount}  // Treat 0 as empty
              onChange={handleAmountChange}
              autoComplete="off"
              type="number"
            />

            <TextField
              sx={amtTextField}
              name="split-amount"
              fullWidth
              label={<Typography variant="body1" color='#fff'>Split Amount</Typography>}
              value={splitAmount === 0 ? '' : splitAmount}  // Treat 0 as empty
              onChange={handleSplitAmountChange}
              autoComplete="off"
              type="number"  // Enforce numeric input
            />

            <TextField
              sx={amtTextField}
              name="message"
              fullWidth
              label={<Typography variant="body1" color='#fff'>Message</Typography>}
              value={message}
              onChange={handleMessageChange}
              autoComplete="off"
            />

            <CustomFormControl fullWidth>
              <InputLabel>Salary Category</InputLabel>
              <Select
                value={salCat}
                label="Salary Category"
                onChange={handleSalaryChange}
              >
                {salaryCat.map((sal, index) => (
                  <MenuItem key={index} value={sal}>
                    {sal}
                  </MenuItem>
                ))}
              </Select>
            </CustomFormControl>

            <Button variant="contained" sx={buttonStyle} onClick={handleAddTransaction}>Add Transaction</Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarType} sx={{ width: '100%', color: "#1c1917", backgroundColor: '#f2f2f2', borderRadius: '25px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Topbar
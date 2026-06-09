"use client"
import React from 'react'
import { Alert, Accordion, AccordionDetails, AccordionSummary, Chip, Dialog, DialogContent, IconButton, Snackbar, Stack, useMediaQuery, useTheme } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import { addIconButton, amtTextField, buttonStyle, CustomFormControl, CustomFormControlRadio, modalActions, modalPrimaryButton, modalSecondaryButton, quickAddActions, quickAddCard, quickAddMeta, quickAddRow, templateCard, templateCardActions, templateList, templateSection, title, topbarStack } from './styles';
import { Box, Button, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Slide, { SlideProps } from '@mui/material/Slide';
import { TransactionData } from '@/types/transaction';
import { buildQuickAddDraft } from '@/utils/quickAdd';
import { submitTransaction } from '@/utils/transactions';
import { buildManualTemplate, TEMPLATE_STORAGE_KEY, TransactionTemplate } from '@/utils/templates';

function SlideTransition(props: React.JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="up" />;
}

interface AddTransactionProps {
  onTransactionAdded: () => void;
  transactions: TransactionData[];
}

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

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface BrowserSpeechWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

const Topbar: React.FC<AddTransactionProps> = ({ onTransactionAdded, transactions }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  const [quickInput, setQuickInput] = React.useState('');
  const [quickPaymentOverride, setQuickPaymentOverride] = React.useState('');
  const [templates, setTemplates] = React.useState<TransactionTemplate[]>([]);
  const [templateName, setTemplateName] = React.useState('');
  const [mobileAdvancedOpen, setMobileAdvancedOpen] = React.useState(false);
  const [mobileFavoritesExpanded, setMobileFavoritesExpanded] = React.useState(false);
  const [voiceSupported, setVoiceSupported] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetStates();
    setMobileAdvancedOpen(false);
    setOpen(false);
  };
  const resetStates = () => {
    setCategory('');
    setSalCat('');
    setPaymentMethod('');
    setAmount(0);
    setSplitAmount(0);
    setMessage('');
    setTransactionType('Expense');
  };

  React.useEffect(() => {
    if (!open || !isMobile) {
      return;
    }

    if (!paymentMethod) {
      setPaymentMethod('UPI');
    }

    if (!salCat) {
      setSalCat('Needs');
    }
  }, [open, isMobile, paymentMethod, salCat]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedTemplates = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!storedTemplates) {
      return;
    }

    try {
      const parsedTemplates = JSON.parse(storedTemplates) as TransactionTemplate[];
      setTemplates(parsedTemplates);
    } catch {
      setTemplates([]);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const browserWindow = window as BrowserSpeechWindow;
    setVoiceSupported(Boolean(browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition));
  }, []);
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
  const mobileCategoryShortcuts = React.useMemo(() => {
    const counts = transactions
      .filter((transaction) => transaction['Expense/Income'] === 'Expense')
      .reduce<Record<string, number>>((acc, transaction) => {
        acc[transaction.Category] = (acc[transaction.Category] || 0) + 1;
        return acc;
      }, {});

    const ranked = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([categoryName]) => categoryName);

    const merged = [...ranked, ...categories];
    return Array.from(new Set(merged)).slice(0, 5);
  }, [transactions]);

  const quickDraft = React.useMemo(() => {
    const draft = buildQuickAddDraft(quickInput, transactions);

    return {
      ...draft,
      paymentMethod: quickPaymentOverride || draft.paymentMethod || 'UPI',
    };
  }, [quickInput, quickPaymentOverride, transactions]);

  const addManualTemplate = (template: TransactionTemplate) => {
    setTemplates((currentTemplates) => {
      const duplicate = currentTemplates.some(
        (currentTemplate) =>
          currentTemplate.name.toLowerCase() === template.name.toLowerCase() &&
          currentTemplate.message.toLowerCase() === template.message.toLowerCase() &&
          currentTemplate.modeOfPayment === template.modeOfPayment &&
          currentTemplate.category === template.category
      );

      if (duplicate) {
        setSnackbarMessage('That favorite template already exists');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return currentTemplates;
      }

      return [template, ...currentTemplates];
    });
  };

  const saveQuickDraftAsTemplate = () => {
    if (!quickDraft.note.trim()) {
      setSnackbarMessage('Add a quick-add note before saving a favorite');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    const newTemplate = buildManualTemplate({
      name: templateName.trim() || quickDraft.note,
      amount: quickDraft.amount,
      category: quickDraft.category,
      modeOfPayment: quickDraft.paymentMethod,
      salaryBifercationCat: quickDraft.salaryCategory,
      message: quickDraft.note,
    });

    addManualTemplate(newTemplate);
    setTemplateName('');
    setSnackbarMessage('Favorite template saved');
    setSnackbarType('success');
    setSnackbarOpen(true);
  };

  const saveModalDraftAsTemplate = () => {
    const resolvedMessage = message.trim();
    const resolvedAmount = amount === '' ? null : Number(amount);

    if (!resolvedMessage) {
      setSnackbarMessage('Add a message in the full form before saving a favorite');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    if (!category || !paymentMethod || !salCat) {
      setSnackbarMessage('Select category, payment method, and salary category before saving a favorite');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    const newTemplate = buildManualTemplate({
      name: templateName.trim() || resolvedMessage,
      amount: Number.isFinite(resolvedAmount) ? resolvedAmount : null,
      category,
      modeOfPayment: paymentMethod,
      salaryBifercationCat: salCat,
      message: resolvedMessage,
    });

    addManualTemplate(newTemplate);
    setTemplateName('');
    setSnackbarMessage('Favorite template saved from full form');
    setSnackbarType('success');
    setSnackbarOpen(true);
  };

  const applyTemplate = (template: TransactionTemplate) => {
    const inputParts = [template.amount ?? '', template.message, template.modeOfPayment === 'Credit Card' ? 'cc' : template.modeOfPayment.toLowerCase()]
      .filter(Boolean)
      .join(' ');
    setQuickInput(inputParts.trim());
    setQuickPaymentOverride(template.modeOfPayment);
  };

  const editTemplate = (template: TransactionTemplate) => {
    setCategory(template.category);
    setSalCat(template.salaryBifercationCat);
    setPaymentMethod(template.modeOfPayment);
    setAmount(template.amount ?? '');
    setSplitAmount(0);
    setMessage(template.message);
    setTransactionType(template.transactionType);
    setMobileAdvancedOpen(true);
    setOpen(true);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((currentTemplates) => currentTemplates.filter((template) => template.id !== templateId));
  };

  const openModalWithQuickDraft = () => {
    setCategory(quickDraft.category);
    setSalCat(quickDraft.salaryCategory);
    setPaymentMethod(quickDraft.paymentMethod);
    setAmount(quickDraft.amount ?? '');
    setSplitAmount(0);
    setMessage(quickDraft.note);
    setTransactionType('Expense');
    setMobileAdvancedOpen(false);
    setOpen(true);
  };

  const handleAddTransaction = async () => {
    const parsedAmount = parseFloat(amount as string) || 0;
    const parsedSplitAmount = parseFloat(splitAmount as string) || 0;
    try {
      await submitTransaction({
        amount: parsedAmount,
        transactionType,
        paymentMethod,
        category,
        message,
        salaryCategory: salCat,
        splitAmount: parsedSplitAmount,
      });
      handleClose();
      setSnackbarMessage('New Transaction Added Successfully');
      setSnackbarType('success');
      setSnackbarOpen(true);
      onTransactionAdded();
    } catch (error) {
      handleClose();
      setSnackbarMessage(`Error: ${error}`);
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const handleQuickAdd = async () => {
    if (!quickDraft.canSubmit || quickDraft.amount === null) {
      setSnackbarMessage('Enter an amount and note to use quick add');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      await submitTransaction({
        amount: quickDraft.amount,
        transactionType: 'Expense',
        paymentMethod: quickDraft.paymentMethod,
        category: quickDraft.category,
        message: quickDraft.note,
        salaryCategory: quickDraft.salaryCategory,
      });
      setQuickInput('');
      setQuickPaymentOverride('');
      setSnackbarMessage('Quick transaction added successfully');
      setSnackbarType('success');
      setSnackbarOpen(true);
      onTransactionAdded();
    } catch (error) {
      setSnackbarMessage(`Error: ${error}`);
      setSnackbarType('error');
      setSnackbarOpen(true);
    }
  };

  const handleVoiceQuickAdd = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const browserWindow = window as BrowserSpeechWindow;
    const RecognitionCtor = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setSnackbarMessage('Voice entry works best in Chrome or Edge');
      setSnackbarType('error');
      setSnackbarOpen(true);
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();

      if (!transcript) {
        setSnackbarMessage('Could not hear anything clear enough to add');
        setSnackbarType('error');
        setSnackbarOpen(true);
        return;
      }

      setQuickInput((currentValue) => {
        if (!currentValue.trim()) {
          return transcript;
        }
        return `${currentValue.trim()} ${transcript}`.trim();
      });
      setQuickPaymentOverride('');
      setSnackbarMessage(`Heard: ${transcript}`);
      setSnackbarType('success');
      setSnackbarOpen(true);
    };

    recognition.onerror = (event) => {
      const message =
        event.error === 'not-allowed'
          ? 'Microphone permission was denied'
          : event.error === 'no-speech'
            ? 'No speech detected'
            : 'Voice entry failed';
      setSnackbarMessage(message);
      setSnackbarType('error');
      setSnackbarOpen(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const renderChoiceChips = (
    options: string[],
    value: string,
    onSelect: (nextValue: string) => void,
    activeColor: string
  ) => (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {options.map((option) => (
        <Button
          key={option}
          variant={value === option ? 'contained' : 'outlined'}
          onClick={() => onSelect(option)}
          sx={{
            borderRadius: '999px',
            minHeight: '42px',
            textTransform: 'none',
            fontWeight: 600,
            paddingX: 1.5,
            color: value === option ? '#04130a' : '#f2f2f2',
            borderColor: '#3f3f46',
            backgroundColor: value === option ? activeColor : 'transparent',
            '&:hover': {
              borderColor: activeColor,
              backgroundColor: value === option ? activeColor : '#18181b',
            },
          }}
        >
          {option}
        </Button>
      ))}
    </Box>
  );

  return (
    <div>
      <Stack direction="row" sx={topbarStack}>
        <Typography variant="h4" sx={title}>Kush&apos;s Expense Tracker Dashboard</Typography>
        <IconButton aria-label="add" sx={addIconButton} onClick={handleOpen}>
          <AddCircleIcon />
        </IconButton>
      </Stack>
      <Box sx={quickAddCard}>
        <Typography variant="h6" sx={{ color: '#f2f2f2', fontWeight: 700, marginBottom: '0.75rem' }}>
          Quick Add
        </Typography>
        <Box sx={quickAddRow}>
          <TextField
            sx={{
              ...amtTextField,
              gridColumn: isMobile ? '1 / -1' : 'auto',
              marginTop: 0,
              '& .MuiOutlinedInput-root': {
                ...amtTextField['& .MuiOutlinedInput-root'],
                minHeight: '56px',
              },
            }}
            fullWidth
            placeholder="Try: 120 chai upi or 30 bus"
            value={quickInput}
            onChange={(event) => setQuickInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void handleQuickAdd();
              }
            }}
          />
          <Box sx={{ width: '100%', gridColumn: isMobile ? '1 / 2' : 'auto' }}>
            <Select
              fullWidth
              displayEmpty
              value={quickPaymentOverride}
              onChange={(event) => setQuickPaymentOverride(event.target.value)}
              renderValue={(selected) => (selected ? selected : 'Payment')}
              sx={{
                minHeight: '56px',
                height: '56px',
                color: '#f2f2f2',
                backgroundColor: 'transparent',
                borderRadius: '8px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#f2f2f2',
                  borderWidth: '2px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#f2f2f2',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#f2f2f2',
                },
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '56px',
                  paddingTop: 0,
                  paddingBottom: 0,
                },
                '& .MuiSvgIcon-root': {
                  color: '#f2f2f2',
                },
              }}
            >
              <MenuItem value="">Auto</MenuItem>
              {modeOfPayment.map((pay, index) => (
                <MenuItem key={index} value={pay}>
                  {pay}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <IconButton
            aria-label={isListening ? 'stop voice entry' : 'start voice entry'}
            onClick={handleVoiceQuickAdd}
            disabled={!voiceSupported && !isListening}
            sx={{
              marginTop: 0,
              height: '56px',
              width: '56px',
              minWidth: '56px',
              justifySelf: isMobile ? 'stretch' : 'auto',
              justifyContent: 'center',
              borderRadius: '16px',
              border: '1px solid',
              borderColor: isListening ? '#22c55e' : '#3f3f46',
              backgroundColor: isListening ? '#14532d' : '#0c0a09',
              color: isListening ? '#86efac' : '#f2f2f2',
              '&:hover': {
                backgroundColor: isListening ? '#166534' : '#18181b',
              },
              '&.Mui-disabled': {
                color: '#71717a',
                borderColor: '#27272a',
              },
            }}
          >
            <MicIcon />
          </IconButton>
          <Button
            variant="contained"
            sx={{ ...buttonStyle, gridColumn: isMobile ? '1 / -1' : 'auto', marginTop: 0, height: '56px' }}
            onClick={handleQuickAdd}
          >
            Save Quick
          </Button>
        </Box>
        {quickInput.trim() && (
          <Box sx={quickAddMeta}>
            <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
              {quickDraft.amount !== null ? `Ready: ₹${quickDraft.amount} for ${quickDraft.note || 'new expense'}` : 'Add an amount to continue'}
            </Typography>
            {isListening && (
              <Chip label="Listening..." sx={{ backgroundColor: '#166534', color: '#fff' }} />
            )}
            <Chip label={quickDraft.category} sx={{ backgroundColor: '#ef4444', color: '#fff' }} />
            <Chip label={quickDraft.salaryCategory} sx={{ backgroundColor: '#1d4ed8', color: '#fff' }} />
            <Chip label={quickDraft.paymentMethod} sx={{ backgroundColor: '#374151', color: '#fff' }} />
            <Box sx={quickAddActions}>
              <Button variant="text" sx={{ color: '#f2f2f2' }} onClick={openModalWithQuickDraft}>
                Edit Details
              </Button>
              <Button variant="text" sx={{ color: '#22c55e' }} onClick={saveQuickDraftAsTemplate}>
                Save Template
              </Button>
            </Box>
          </Box>
        )}
        <Box sx={templateSection}>
          {isMobile ? (
            <Accordion
              expanded={mobileFavoritesExpanded}
              onChange={(_, expanded) => setMobileFavoritesExpanded(expanded)}
              disableGutters
              sx={{
                backgroundColor: 'transparent',
                color: '#f2f2f2',
                boxShadow: 'none',
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#f2f2f2' }} />}
                sx={{ paddingX: 0, minHeight: '48px !important' }}
              >
                <Typography variant="subtitle1" sx={{ color: '#f2f2f2', fontWeight: 700 }}>
                  Favorites
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ paddingX: 0, paddingBottom: 0 }}>
                <Box sx={templateCardActions}>
                  {!quickDraft.note.trim() && (
                    <Typography variant="body2" sx={{ color: '#a3a3a3', alignSelf: 'center' }}>
                      No active quick-add draft yet.
                    </Typography>
                  )}
                </Box>
                <Box sx={templateList}>
                  {templates.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                      Save a quick-add draft as a template to start building your favorites list.
                    </Typography>
                  ) : (
                    templates.map((template) => (
                      <Box key={template.id} sx={templateCard}>
                        <Typography variant="subtitle1" sx={{ color: '#f2f2f2', fontWeight: 700 }}>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#a3a3a3', marginTop: '0.35rem' }}>
                          {template.amount !== null ? `₹${template.amount} · ` : ''}{template.message}
                        </Typography>
                        <Box sx={quickAddMeta}>
                          <Chip label={template.category} size="small" sx={{ backgroundColor: '#ef4444', color: '#fff' }} />
                          <Chip label={template.modeOfPayment} size="small" sx={{ backgroundColor: '#374151', color: '#fff' }} />
                        </Box>
                        <Box sx={templateCardActions}>
                          <Button variant="contained" sx={{ ...buttonStyle, marginTop: 0, width: 'auto' }} onClick={() => applyTemplate(template)}>
                            Use Now
                          </Button>
                          <Button variant="text" sx={{ color: '#f2f2f2' }} onClick={() => editTemplate(template)}>
                            Edit
                          </Button>
                          <Button variant="text" sx={{ color: '#ef4444' }} onClick={() => deleteTemplate(template.id)}>
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ color: '#f2f2f2', fontWeight: 700 }}>
                Favorites
              </Typography>
              <Box sx={templateCardActions}>
                {!quickDraft.note.trim() && (
                  <Typography variant="body2" sx={{ color: '#a3a3a3', alignSelf: 'center' }}>
                    No active quick-add draft yet.
                  </Typography>
                )}
              </Box>
              <Box sx={templateList}>
                {templates.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                    Save a quick-add draft as a template to start building your favorites list.
                  </Typography>
                ) : (
                  templates.map((template) => (
                    <Box key={template.id} sx={templateCard}>
                      <Typography variant="subtitle1" sx={{ color: '#f2f2f2', fontWeight: 700 }}>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#a3a3a3', marginTop: '0.35rem' }}>
                        {template.amount !== null ? `₹${template.amount} · ` : ''}{template.message}
                      </Typography>
                      <Box sx={quickAddMeta}>
                        <Chip label={template.category} size="small" sx={{ backgroundColor: '#ef4444', color: '#fff' }} />
                        <Chip label={template.modeOfPayment} size="small" sx={{ backgroundColor: '#374151', color: '#fff' }} />
                      </Box>
                      <Box sx={templateCardActions}>
                        <Button variant="contained" sx={{ ...buttonStyle, marginTop: 0, width: 'auto' }} onClick={() => applyTemplate(template)}>
                          Use Now
                        </Button>
                        <Button variant="text" sx={{ color: '#f2f2f2' }} onClick={() => editTemplate(template)}>
                          Edit
                        </Button>
                        <Button variant="text" sx={{ color: '#ef4444' }} onClick={() => deleteTemplate(template.id)}>
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isMobile}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: isMobile
            ? {
              backgroundColor: '#1c1917',
              color: '#f2f2f2',
              display: 'flex',
              flexDirection: 'column',
            }
            : {
              backgroundColor: '#1c1917',
              color: '#f2f2f2',
              borderRadius: '24px',
            },
        }}
      >
        <DialogContent
          sx={{
            padding: isMobile ? 0 : 3,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <Box
            sx={{
              paddingX: isMobile ? 2 : 0,
              paddingTop: isMobile ? 2 : 0,
              paddingBottom: isMobile ? 1 : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ color: '#f2f2f2', fontWeight: 700 }}>
                {isMobile ? 'Quick mobile entry' : 'Add transaction'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#a3a3a3', marginTop: 0.5 }}>
                {isMobile ? 'Amount first, then note, then only the details you need.' : 'Fill in the details and save the transaction or favorite.'}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: '#f2f2f2' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              paddingX: isMobile ? 2 : 0,
              paddingBottom: isMobile ? 14 : 0,
            }}
          >
            {isMobile ? (
              <>
                <Box sx={{ marginTop: 1.25 }}>
                  <Typography variant="body2" sx={{ color: '#a3a3a3', marginBottom: 1 }}>
                    Entry type
                  </Typography>
                  {renderChoiceChips(['Expense', 'Income'], transactionType, (nextValue) => setTransactionType(nextValue as 'Expense' | 'Income'), '#22c55e')}
                </Box>

                <TextField
                  sx={{
                    ...amtTextField,
                    marginTop: '1.1rem',
                    '& .MuiOutlinedInput-root': {
                      ...amtTextField['& .MuiOutlinedInput-root'],
                      minHeight: '64px',
                    },
                  }}
                  name="amount"
                  fullWidth
                  label={<Typography variant="body1" color="#fff">Amount</Typography>}
                  value={amount === 0 ? '' : amount}
                  onChange={handleAmountChange}
                  autoComplete="off"
                  type="number"
                />

                <TextField
                  sx={{
                    ...amtTextField,
                    '& .MuiOutlinedInput-root': {
                      ...amtTextField['& .MuiOutlinedInput-root'],
                      minHeight: '60px',
                    },
                  }}
                  name="message"
                  fullWidth
                  label={<Typography variant="body1" color="#fff">Note</Typography>}
                  value={message}
                  onChange={handleMessageChange}
                  autoComplete="off"
                  placeholder="Bus, rent, chai, recharge..."
                />

                <Box sx={{ marginTop: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#a3a3a3', marginBottom: 1 }}>
                    Payment
                  </Typography>
                  {renderChoiceChips(modeOfPayment, paymentMethod, setPaymentMethod, '#3b82f6')}
                </Box>

                <Box sx={{ marginTop: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#a3a3a3', marginBottom: 1 }}>
                    Category
                  </Typography>
                  {renderChoiceChips(mobileCategoryShortcuts, category, setCategory, '#ef4444')}
                </Box>

                <Box sx={{ marginTop: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#a3a3a3', marginBottom: 1 }}>
                    Salary category
                  </Typography>
                  {renderChoiceChips(salaryCat, salCat, setSalCat, '#8b5cf6')}
                </Box>

                <Accordion
                  expanded={mobileAdvancedOpen}
                  onChange={(_, expanded) => setMobileAdvancedOpen(expanded)}
                  disableGutters
                  sx={{
                    marginTop: 2,
                    backgroundColor: '#0c0a09',
                    color: '#f2f2f2',
                    border: '1px solid #292524',
                    borderRadius: '18px !important',
                    boxShadow: 'none',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#f2f2f2' }} />}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        More details
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
                        Split amount and full fallback selectors
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ paddingTop: 0 }}>
                    <TextField
                      sx={amtTextField}
                      name="split-amount"
                      fullWidth
                      label={<Typography variant="body1" color="#fff">Split Amount</Typography>}
                      value={splitAmount === 0 ? '' : splitAmount}
                      onChange={handleSplitAmountChange}
                      autoComplete="off"
                      type="number"
                    />

                    <CustomFormControl fullWidth>
                      <InputLabel>Select Category</InputLabel>
                      <Select value={category} label="Select Category" onChange={handleCategoryChange}>
                        {categories.map((categoryOption, index) => (
                          <MenuItem key={index} value={categoryOption}>
                            {categoryOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </CustomFormControl>

                    <CustomFormControl fullWidth>
                      <InputLabel>Mode Of Payment</InputLabel>
                      <Select value={paymentMethod} label="Mode Of Payment" onChange={handlePaymentChange}>
                        {modeOfPayment.map((pay, index) => (
                          <MenuItem key={index} value={pay}>
                            {pay}
                          </MenuItem>
                        ))}
                      </Select>
                    </CustomFormControl>

                    <CustomFormControl fullWidth>
                      <InputLabel>Salary Category</InputLabel>
                      <Select value={salCat} label="Salary Category" onChange={handleSalaryChange}>
                        {salaryCat.map((salaryOption, index) => (
                          <MenuItem key={index} value={salaryOption}>
                            {salaryOption}
                          </MenuItem>
                        ))}
                      </Select>
                    </CustomFormControl>
                  </AccordionDetails>
                </Accordion>
              </>
            ) : (
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
                  <Select value={category} label="Select Category" onChange={handleCategoryChange}>
                    {categories.map((categoryOption, index) => (
                      <MenuItem key={index} value={categoryOption}>
                        {categoryOption}
                      </MenuItem>
                    ))}
                  </Select>
                </CustomFormControl>

                <CustomFormControl fullWidth>
                  <InputLabel>Mode Of Payment</InputLabel>
                  <Select value={paymentMethod} label="Mode Of Payment" onChange={handlePaymentChange}>
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
                  label={<Typography variant="body1" color="#fff">Amount</Typography>}
                  value={amount === 0 ? '' : amount}
                  onChange={handleAmountChange}
                  autoComplete="off"
                  type="number"
                />

                <TextField
                  sx={amtTextField}
                  name="split-amount"
                  fullWidth
                  label={<Typography variant="body1" color="#fff">Split Amount</Typography>}
                  value={splitAmount === 0 ? '' : splitAmount}
                  onChange={handleSplitAmountChange}
                  autoComplete="off"
                  type="number"
                />

                <TextField
                  sx={amtTextField}
                  name="message"
                  fullWidth
                  label={<Typography variant="body1" color="#fff">Message</Typography>}
                  value={message}
                  onChange={handleMessageChange}
                  autoComplete="off"
                />

                <CustomFormControl fullWidth>
                  <InputLabel>Salary Category</InputLabel>
                  <Select value={salCat} label="Salary Category" onChange={handleSalaryChange}>
                    {salaryCat.map((salaryOption, index) => (
                      <MenuItem key={index} value={salaryOption}>
                        {salaryOption}
                      </MenuItem>
                    ))}
                  </Select>
                </CustomFormControl>

                <Box sx={modalActions}>
                  <Button variant="contained" sx={modalPrimaryButton} onClick={handleAddTransaction}>
                    Add Transaction
                  </Button>
                  <Button variant="outlined" sx={modalSecondaryButton} onClick={saveModalDraftAsTemplate}>
                    Save As Favorite
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {isMobile && (
            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 2,
                backgroundColor: '#1c1917',
                borderTop: '1px solid #292524',
              }}
            >
              <Box sx={modalActions}>
                <Button variant="contained" sx={modalPrimaryButton} onClick={handleAddTransaction}>
                  Add Transaction
                </Button>
                <Button variant="outlined" sx={modalSecondaryButton} onClick={saveModalDraftAsTemplate}>
                  Save As Favorite
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
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

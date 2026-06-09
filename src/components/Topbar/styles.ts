import { FormControl } from "@mui/material";
import styled from "styled-components";

export const topbarStack = {
    display: "flex",
    justifyContent: "space-between",
    color: '#f2f2f2',
    alignItems: 'center',
}

export const addIconButton = {
    color: " #22c55e",
}

export const buttonStyle = {
    background: '#22c55e',
    color: "#052e16",
    fontWeight: 600,
    marginTop: '1rem',
    width: '100%',
    borderRadius: '25px'
}

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 280,
    backgroundColor: "#1c1917",
    color: '#f2f2f2',
    p: 4,
};

export const title = {
    padding: '0 16px',
    "@media (max-width:540px)": {
        fontSize:'1.3rem'
    },
}

export const quickAddCard = {
    backgroundColor: '#1c1917',
    border: '1px solid #292524',
    borderRadius: '20px',
    padding: '1rem',
    marginTop: '1rem',
}

export const quickAddRow = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 150px 56px 160px',
    gap: '0.75rem',
    alignItems: 'center',
    "@media (max-width:900px)": {
        gridTemplateColumns: 'minmax(0, 1fr) 130px 56px 140px',
    },
    "@media (max-width:540px)": {
        gridTemplateColumns: 'minmax(0, 1fr) 72px',
    },
}

export const quickAddMeta = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.75rem',
    alignItems: 'center',
}

export const quickAddActions = {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    "@media (max-width:540px)": {
        justifyContent: 'stretch',
        flexDirection: 'column',
    },
}

export const templateSection = {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #292524',
}

export const templateList = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '0.75rem',
}

export const templateCard = {
    backgroundColor: '#0c0a09',
    border: '1px solid #292524',
    borderRadius: '16px',
    padding: '0.75rem',
    minWidth: '220px',
    flex: '1 1 220px',
}

export const templateCardActions = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
    flexWrap: 'wrap',
}

export const modalActions = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginTop: '1.25rem',
    alignItems: 'stretch',
    "@media (max-width:540px)": {
        gridTemplateColumns: '1fr',
    },
}

export const modalPrimaryButton = {
    background: '#22c55e',
    color: '#052e16',
    fontWeight: 700,
    minHeight: '56px',
    borderRadius: '18px',
    padding: '0.85rem 1rem',
    textTransform: 'none',
    fontSize: '0.98rem',
    lineHeight: 1.2,
    boxShadow: 'none',
    '&:hover': {
        background: '#16a34a',
        boxShadow: 'none',
    },
}

export const modalSecondaryButton = {
    minHeight: '56px',
    borderRadius: '18px',
    padding: '0.85rem 1rem',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.98rem',
    lineHeight: 1.2,
    color: '#f2f2f2',
    borderColor: '#3f3f46',
    backgroundColor: '#0c0a09',
    '&:hover': {
        borderColor: '#22c55e',
        backgroundColor: '#18181b',
    },
}

export const CustomFormControl = styled(FormControl)({
    '& .MuiInputLabel-root': {
        color: '#f2f2f2', // Label color
        borderWidth: '2px'
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#f2f2f2', // Outline color
            borderWidth: '2px',
        },
        '&:hover fieldset': {
            borderColor: '#f2f2f2', // Outline color on hover
        },
        '&.Mui-focused fieldset': {
            borderColor: '#f2f2f2', // Outline color when focused
        },
        '& input': {
            color: '#f2f2f2', // Input text color
        },
    },
    '& .MuiSelect-root': {
        color: '#f2f2f2', // Selected text color
    },
    '& .MuiSvgIcon-root': {
        color: '#f2f2f2', // Dropdown icon color
    },
    '& .MuiOutlinedInput-input': {
        color: '#f2f2f2', // Dropdown icon color
    },
    marginTop: '1rem'
});

export const CustomFormControlRadio = styled(FormControl)({
    '& .MuiFormLabel-root': {
        color: '#f2f2f2', // Label color
    },
    '& .MuiRadio-root': {
        color: '#f2f2f2', // Radio button color
    },
    '& .MuiFormControlLabel-label': {
        color: '#f2f2f2', // Label color
    },
    '& .MuiFormControl-root': {
        borderColor: '#f2f2f2', // Outline color if necessary
    }
});

export const amtTextField = {
    "& .MuiOutlinedInput-root": {
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#f2f2f2",
            borderWidth: "2px",
        },
        '&:hover fieldset': {
            borderColor: '#f2f2f2',
        },
        '& .MuiOutlinedInput-input': {
            color: '#f2f2f2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#f2f2f2',
        },
    },
    marginTop: '1rem'
}

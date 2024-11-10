import { FormControl } from "@mui/material";
import styled from "styled-components";

export const topbarStack = {
    display: "flex",
    justifyContent: "space-between",
    color: '#f2f2f2'
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
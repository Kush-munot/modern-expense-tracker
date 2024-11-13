export const cardStyles = {
    backgroundColor: "#1c1917",
    width: '99%',
    borderRadius: '15px',
    position: 'relative',
    right: '10px',
    "@media (max-width:540px)": {
        position: "relative",
        right: '0px',
        width: '100%'
    },
}
export const cardStyles1 = {
    backgroundColor: "#1c1917",
    width: '99%',
    height: '442px',
    overflowY: 'scroll',
    borderRadius: '15px',
    position: 'relative',
    right: '-16px',
    "&::-webkit-scrollbar": {
        display: "none"
    },
    // Hide scrollbar for Firefox
    scrollbarWidth: "none",
    "@media (max-width:540px)": {
        position: 'relative',
        right: '0px',
        width: '100%'
    },
}

export const balanceStyle = {
    background: "#22c55e",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontSize: '22px',
}

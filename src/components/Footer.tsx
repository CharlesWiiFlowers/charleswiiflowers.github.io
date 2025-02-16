function Footer(){
    return <footer style={footerStyle}>
        <p>
            Made with love 💖
        </p>
        <p>
            Charles Flowers | {new Date().getFullYear()} |
            <a href="https://github.com/charleswiiflowers" target="_blank" rel="noopener noreferrer" style={linkStyle}> GitHub</a>
        </p>
    </footer>
}

const footerStyle = {
    width: "100%",
    backgroundColor: "#fcfbfe",
    textAlign: "center" as const,
    position: "absolute" as const,

}

const linkStyle = {
    color: "#4fd1c5",
    textDecoration: "none",
    fontWeight: "bold",
}

export default Footer
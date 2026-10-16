import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-line">Made with love 💖</p>
      <p className="footer-line">
        Charles Flowers | {new Date().getFullYear()} |{" "}
        <a href="https://github.com/charleswiiflowers" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </p>
    </footer>
  );
}

export default Footer;

import logo from "../assets/KoinX_Logo.png";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="top-header">
      <img src={logo} alt="KoinX Logo" className="top-header-logo" />
    </header>
  );
}

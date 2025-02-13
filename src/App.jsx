import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./Components/Layout/ThemeContext";
import { AppRoutes } from "./Route";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;

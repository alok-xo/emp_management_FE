import React, { createContext, useState, useContext } from "react";

// Create Theme Context
const ThemeContext = createContext();

// Custom Hook to Use Theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default Theme

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme} style={{ fontFamily: "Montserrat, sans-serif" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

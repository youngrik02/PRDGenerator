import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./app/App.tsx";
import "./styles/index.css";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <App />
    </ThemeProvider>
  );
}
  
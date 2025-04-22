import { ThemeProvider, useTheme } from "@/lib/theme-context";
import Swal from "sweetalert2";

export const getToast = (
  typeIcon: "success" | "error" | "warning" | "info",
  msg: string,
  timerProgressBar: boolean = false
) => {
  const theme = useTheme();
  Swal.fire({
    toast: true,
    position: "top",
    showConfirmButton: false,
    icon: typeIcon,
    timerProgressBar,
    timer: 3000,
    title: msg,
    background: theme.theme === "dark" ? "#2d343c" : "white",
    color: theme.theme === "dark" ? "white" : "black",
  });
};

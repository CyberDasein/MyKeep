import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Notes from "./pages/Notes";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthProvider";
import { PrivateRoute } from "./components/PrivateRoute";
import { RegisterForm } from "./pages/Registration";

function App() {
  return (
    <AuthProvider>
      <MantineProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Notes />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </MantineProvider>
    </AuthProvider>
  );
}

export default App;

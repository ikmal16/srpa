import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Students from "./pages/Student";
import CreateStudent from "./pages/CreateStudent";
import EditStudent from "./pages/EditStudent";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import StudentDetails from "./pages/StudentDetails";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route element={<RoleRoute allowedRoles={["pegawai"]} />}>
            <Route path="/students/create" element={<CreateStudent />} />

            <Route path="/students/:id/edit" element={<EditStudent />} />
          </Route>
          <Route path="/reports" element={<Reports />} />
          <Route path="/students/:id" element={<StudentDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

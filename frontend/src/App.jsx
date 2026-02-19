import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout role="student" username="Jaya">
              <StudentDashboard />
            </Layout>
          }
        />

        <Route
          path="/student"
          element={
            <Layout role="student" username="Jaya">
              <StudentDashboard />
            </Layout>
          }
        />

        <Route
          path="/instructor"
          element={
            <Layout role="instructor" username="Jaya">
              <InstructorDashboard />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import Settings from './pages/settings.jsx';
import Login from './pages/login.jsx';
import Verify from './pages/verify.jsx';
import NewAuth from './pages/newAuth.jsx';
import ManageExam from './pages/exam/manageExam.jsx';
import EditExam from './pages/exam/editExam.jsx';

function App() {
  const userType = "admin";
  return (
    <Router>
      <Routes>
        {userType === "admin" ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route path="/authNewUser/verify" element={<NewAuth />} />
            <Route path="/exam/manageExam" element={<ManageExam />} />
            <Route path="/exam/editExam/:id" element={<EditExam />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/verify" element={<Verify />} />
            <Route path="/authNewUser/verify" element={<NewAuth />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

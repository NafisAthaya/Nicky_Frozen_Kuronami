import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import BranchSelection from './pages/BranchSelection/BranchSelection';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/branch-selection" element={<BranchSelection />} />
      </Routes>
    </Router>
  );
}

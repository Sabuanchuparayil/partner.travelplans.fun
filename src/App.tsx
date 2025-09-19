
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ItinerariesPage from './pages/ItinerariesPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage';
import CustomerManagement from './pages/CustomerManagement'; // Updated import
import BookingsPage from './pages/BookingsPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import CompliancePage from './pages/CompliancePage';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/shared/PrivateRoute';
import Layout from './components/Layout'; // Import the new Layout component
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/itineraries" element={<ItinerariesPage />} />
            <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
            <Route path="/customers" element={<CustomerManagement />} /> {/* Updated route */}
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
          </Route>
        </Route>

        {/* Redirect root to dashboard if logged in, otherwise to login */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;

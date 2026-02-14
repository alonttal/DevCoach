import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DigestPage } from './pages/DigestPage';
import { ProfilePage } from './pages/ProfilePage';
import { DeepDivePage } from './pages/DeepDivePage';
import { ChallengePage } from './pages/ChallengePage';
import { HistoryPage } from './pages/HistoryPage';
import { FavoritesPage } from './pages/FavoritesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DigestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/deepdive/:id" element={<DeepDivePage />} />
          <Route path="/challenge/:id" element={<ChallengePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

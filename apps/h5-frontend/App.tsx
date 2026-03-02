
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Coupons from './pages/Coupons';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Wallet from './pages/Wallet';
import Reservation from './pages/Reservation';
import ReservationDetail from './pages/ReservationDetail';
import Queue from './pages/Queue';
import Feedback from './pages/Feedback';
import Permissions from './pages/Permissions';
import CanteenSelect from './pages/CanteenSelect';
import CanteenMenu from './pages/CanteenMenu';
import { DishDetail, NoticeDetail } from './pages/Details';
import Prayer from './pages/Prayer';
import Divination from './pages/Divination';
import { injectTheme, ThemeKey } from './theme/tokens';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>((localStorage.getItem('user_theme') as ThemeKey) || 'T2');

  const hideNavPaths = [
    '/register', '/wallet', '/reservation', '/queue',
    '/feedback', '/appeal', '/permissions', '/dish', '/notice',
    '/canteen', '/profile/edit', '/profile/password',
    '/prayer', '/divination'
  ];
  const showNav = !hideNavPaths.some(p => location.pathname.startsWith(p));

  useEffect(() => {
    // 初始化数据
    if (!localStorage.getItem('user_balance')) {
      localStorage.setItem('user_balance', '245.50');
    }
    injectTheme(currentTheme);
  }, [currentTheme]);

  return (
    <div className="h-screen max-w-md mx-auto relative bg-[var(--bg)] border-x border-slate-100 shadow-2xl flex flex-col overflow-hidden">
      <ScrollToTop />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg)] relative">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/profile" element={<Profile currentTheme={currentTheme} onThemeChange={setCurrentTheme} />} />
          <Route path="/profile/edit" element={<Register mode="edit" />} />
          <Route path="/profile/password" element={<Register mode="password" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservation/:id" element={<ReservationDetail />} />
          <Route path="/canteen/select" element={<CanteenSelect />} />
          <Route path="/canteen/:id/menu" element={<CanteenMenu />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/appeal" element={<Feedback />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/dish/:id" element={<DishDetail />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/divination" element={<Divination />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      {showNav && <div className="w-full bg-white shrink-0"><BottomNav /></div>}
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;

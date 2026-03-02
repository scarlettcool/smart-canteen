
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './views/Dashboard/Overview';
import PeopleArchiveList from './views/People/PeopleArchiveList';
import OrgStructure from './views/People/OrgStructure';
import RegApproval from './views/People/RegApproval';
import Blacklist from './views/People/Blacklist';
import PreRecordedData from './views/People/PreRecordedData';
import PeopleReports from './views/People/PeopleReports';
import PeopleStats from './views/People/PeopleStats';
import PeopleOptions from './views/People/PeopleOptions';

// Sprint 2 Views
import AccountManagement from './views/Consumption/AccountManagement';
import TradeManagement from './views/Consumption/TradeManagement';
import RefundAudit from './views/Consumption/RefundAudit';
import AppealProcess from './views/Consumption/AppealProcess';
import ReportCenter from './views/Consumption/ReportCenter';
import ConsumptionConfig from './views/Consumption/ConsumptionConfig';
import DeviceManagement from './views/Consumption/DeviceManagement';

// Sprint 3 Views
import DishPublish from './views/Dishes/DishPublish';
import DishArchives from './views/Dishes/DishArchives';
import DishRules from './views/Dishes/DishRules';
import ReservationManagement from './views/Dishes/ReservationManagement';
import FeedbackManagement from './views/Dishes/FeedbackManagement';
import MealTypeManagement from './views/Dishes/MealTypeManagement';
import CanteenManagement from './views/Dishes/CanteenManagement';
import AccountTypeManagement from './views/Dishes/AccountTypeManagement';
import NoticeManagement from './views/Dishes/NoticeManagement';

// Sprint 4 Views
import OperationLogs from './views/System/OperationLogs';
import RoleManagement from './views/System/RoleManagement';
import WeChatConfig from './views/System/WeChatConfig';
import AdminManagement from './views/System/AdminManagement';
import PermissionManagement from './views/System/PermissionManagement';
import SmsConfig from './views/System/SmsConfig';
import HolidaySettings from './views/System/HolidaySettings';
import OpenApiManagement from './views/System/OpenApiManagement';
import MenuSettings from './views/System/MenuSettings';
import FieldMapping from './views/System/FieldMapping';
import ReportConfig from './views/System/ReportConfig';
import PortalCustomization from './views/System/PortalCustomization';

import Placeholder from './views/Placeholder';
import Login from './views/Auth/Login';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            {children}
          </div>
        </main>
        <footer className="h-10 border-t bg-white flex items-center justify-between px-6 text-xs text-slate-400">
          <div>© 2024 智慧食堂管理系统 (政务专用版)</div>
          <div>系统版本: V3.1.0-Release · 54项功能全量交付</div>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />

        {/* Sprint 1: 人员管理 1-12 */}
        <Route path="/people/archive/list" element={<Layout><PeopleArchiveList /></Layout>} />
        <Route path="/people/archive/org" element={<Layout><OrgStructure /></Layout>} />
        <Route path="/people/archive/approval" element={<Layout><RegApproval /></Layout>} />
        <Route path="/people/archive/prerecord" element={<Layout><PreRecordedData /></Layout>} />
        <Route path="/people/report/resigned" element={<Layout><PeopleReports type="resigned" /></Layout>} />
        <Route path="/people/report/stats" element={<Layout><PeopleStats /></Layout>} />
        <Route path="/people/report/birthday" element={<Layout><PeopleReports type="birthday" /></Layout>} />
        <Route path="/people/report/retired" element={<Layout><PeopleReports type="retired" /></Layout>} />
        <Route path="/people/option/attr" element={<Layout><PeopleOptions type="attr" /></Layout>} />
        <Route path="/people/option/dict" element={<Layout><PeopleOptions type="dict" /></Layout>} />
        <Route path="/people/option/id-rule" element={<Layout><PeopleOptions type="id-rule" /></Layout>} />
        <Route path="/people/option/blacklist" element={<Layout><Blacklist /></Layout>} />

        {/* Sprint 2: 消费管理 13-31 */}
        <Route path="/consumption/accounts" element={<Layout><AccountManagement /></Layout>} />
        <Route path="/consumption/trade/tx" element={<Layout><TradeManagement /></Layout>} />
        <Route path="/consumption/trade/refund" element={<Layout><RefundAudit /></Layout>} />
        <Route path="/consumption/trade/appeal" element={<Layout><AppealProcess /></Layout>} />
        <Route path="/consumption/report/:type" element={<Layout><ReportCenter /></Layout>} />
        <Route path="/consumption/config" element={<Layout><ConsumptionConfig /></Layout>} />
        <Route path="/consumption/devices" element={<Layout><DeviceManagement /></Layout>} />

        {/* Sprint 3: 菜品管理 32-41 */}
        <Route path="/dishes/publish" element={<Layout><DishPublish /></Layout>} />
        <Route path="/dishes/archives" element={<Layout><DishArchives /></Layout>} />
        <Route path="/dishes/rules" element={<Layout><DishRules /></Layout>} />
        <Route path="/dishes/reservations" element={<Layout><ReservationManagement /></Layout>} />
        <Route path="/dishes/feedback" element={<Layout><FeedbackManagement /></Layout>} />
        <Route path="/dishes/meal-types" element={<Layout><MealTypeManagement /></Layout>} />
        <Route path="/dishes/canteen-info" element={<Layout><CanteenManagement /></Layout>} />
        <Route path="/dishes/account-types" element={<Layout><AccountTypeManagement /></Layout>} />
        <Route path="/dishes/notices" element={<Layout><NoticeManagement /></Layout>} />
        <Route path="/dishes/announcements" element={<Layout><NoticeManagement /></Layout>} />

        {/* Sprint 4: 系统设置 42-54 */}
        <Route path="/system/logs" element={<Layout><OperationLogs /></Layout>} />
        <Route path="/system/roles" element={<Layout><RoleManagement /></Layout>} />
        <Route path="/system/admins" element={<Layout><AdminManagement /></Layout>} />
        <Route path="/system/wechat" element={<Layout><WeChatConfig /></Layout>} />
        <Route path="/system/perms" element={<Layout><PermissionManagement /></Layout>} />
        <Route path="/system/sms" element={<Layout><SmsConfig /></Layout>} />
        <Route path="/system/openapi" element={<Layout><OpenApiManagement /></Layout>} />
        <Route path="/system/holidays" element={<Layout><HolidaySettings /></Layout>} />
        <Route path="/system/menus" element={<Layout><MenuSettings /></Layout>} />
        <Route path="/system/field-map" element={<Layout><FieldMapping /></Layout>} />
        <Route path="/system/report-config" element={<Layout><ReportConfig /></Layout>} />
        <Route path="/system/plugins" element={<Layout><OpenApiManagement /></Layout>} />
        <Route path="/system/portal" element={<Layout><PortalCustomization /></Layout>} />

        <Route path="*" element={<Layout><Placeholder /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;

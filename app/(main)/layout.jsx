import { checkUser } from '@/lib/checkUser';
import DashboardShell from './dashboard/dashboard-shell';

const MainLayout = async ({ children }) => {
  await checkUser();

  return <DashboardShell>{children}</DashboardShell>;
};

export default MainLayout;

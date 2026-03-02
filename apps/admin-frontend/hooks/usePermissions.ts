
import { useMemo } from 'react';

// Mock current user state - in a real app, this comes from a Global Store/Context
const MOCK_USER = {
  role: 'SUPER_ADMIN',
  permissions: ['ALL'] // Or a list like ['PEOPLE_ARCHIVE_READ', 'CONSUME_ACCOUNT_ADJUST']
};

export const usePermissions = () => {
  const user = MOCK_USER;

  const hasPermission = (permission: string) => {
    if (user.permissions.includes('ALL')) return true;
    return user.permissions.includes(permission);
  };

  const checkMultiple = (perms: string[]) => {
    if (user.permissions.includes('ALL')) return true;
    return perms.every(p => user.permissions.includes(p));
  };

  return {
    user,
    hasPermission,
    checkMultiple
  };
};

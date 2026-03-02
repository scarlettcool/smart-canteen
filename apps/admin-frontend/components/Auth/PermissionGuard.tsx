
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGuardProps {
  permission: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Higher Order Component to protect UI elements based on RBAC
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  fallback = null, 
  children 
}) => {
  const { hasPermission, checkMultiple } = usePermissions();

  const isAllowed = Array.isArray(permission) 
    ? checkMultiple(permission) 
    : hasPermission(permission);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;

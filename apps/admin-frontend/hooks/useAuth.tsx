/**
 * Admin 权限 Hook
 * 
 * 提供权限检查和用户状态管理
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, hasPermission, hasRole, clearToken } from '../services/api';

export interface User {
    id: string;
    username: string;
    name: string;
    roles: string[];
    permissions?: string[];
    deptId?: string;
    canteenId?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        if (!currentUser) {
            navigate('/login');
        }
    }, [navigate]);

    const logout = useCallback(() => {
        clearToken();
        setUser(null);
        navigate('/login');
    }, [navigate]);

    const checkPermission = useCallback((permission: string) => {
        return hasPermission(permission);
    }, []);

    const checkRole = useCallback((role: string) => {
        return hasRole(role);
    }, []);

    return {
        user,
        loading,
        logout,
        hasPermission: checkPermission,
        hasRole: checkRole,
        isAuthenticated: !!user,
        isSuperAdmin: user?.roles?.includes('SUPER_ADMIN') || false,
    };
};

/**
 * 权限守卫 HOC
 */
export const withPermission = (
    WrappedComponent: React.ComponentType,
    requiredPermission: string,
    fallback?: React.ReactNode
) => {
    return (props: any) => {
        const { hasPermission, loading } = useAuth();

        if (loading) {
            return <div className="flex items-center justify-center h-64" > 加载中...</div>;
        }

        if (!hasPermission(requiredPermission)) {
            return (
                fallback || (
                    <div className= "flex flex-col items-center justify-center h-64 text-slate-400" >
                <svg className="w-16 h-16 mb-4" fill = "none" viewBox = "0 0 24 24" stroke = "currentColor" >
                    <path strokeLinecap="round" strokeLinejoin = "round" strokeWidth = { 1.5} d = "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        < p className = "text-lg font-medium" > 权限不足 </p>
                            < p className = "text-sm mt-1" > 您没有访问此页面的权限 </p>
                                </div>
        )
      );
    }

return <WrappedComponent { ...props } />;
  };
};

/**
 * 权限按钮组件
 */
export const PermissionButton: React.FC<{
    permission: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}> = ({ permission, children, onClick, className, disabled }) => {
    const permitted = hasPermission(permission);

    if (!permitted) {
        return null;
    }

    return (
        <button onClick= { onClick } className = { className } disabled = { disabled } >
            { children }
            </button>
  );
};

export default useAuth;

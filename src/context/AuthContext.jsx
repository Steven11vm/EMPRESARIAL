import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
};

const PERMISSIONS = {
  [ROLES.ADMIN]: ['dashboard', 'logs', 'export', 'users', 'settings'],
  [ROLES.MANAGER]: ['dashboard', 'logs', 'export'],
  [ROLES.VIEWER]: ['dashboard'],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'María García',
    email: 'maria.garcia@empresa.com',
    role: ROLES.ADMIN,
  });

  const hasPermission = (permission) =>
    PERMISSIONS[user.role]?.includes(permission) ?? false;

  const setRole = (role) => setUser((u) => ({ ...u, role }));

  return (
    <AuthContext.Provider value={{ user, hasPermission, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

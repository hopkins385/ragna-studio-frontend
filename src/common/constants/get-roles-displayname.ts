const roleDisplayNames = {
  admin: 'Administrator',
  user: 'User',
};

export const getRoleDisplayName = (role: { name: string }) => {
  return roleDisplayNames[role.name as keyof typeof roleDisplayNames] || '-';
};

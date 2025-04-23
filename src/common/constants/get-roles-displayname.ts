const roleDisplayNames = {
  platform_owner: 'Platform Owner',
  admin: 'Administrator',
  user: 'User',
};

export const getRoleDisplayName = (role: { name: string }) => {
  return roleDisplayNames[role.name as keyof typeof roleDisplayNames] || '-';
};

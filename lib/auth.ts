export const normalizeEmail = (email?: string | null) => email?.trim().toLowerCase() ?? '';

export const isAdminEmail = (email?: string | null) => {
  const configuredAdminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  return Boolean(configuredAdminEmail) && normalizeEmail(email) === configuredAdminEmail;
};

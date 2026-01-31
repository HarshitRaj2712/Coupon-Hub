export function isAdmin(user) {
  return Array.isArray(user?.roles) && user.roles.includes("admin");
}

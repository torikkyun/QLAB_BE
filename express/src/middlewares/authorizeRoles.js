export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.roleName)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

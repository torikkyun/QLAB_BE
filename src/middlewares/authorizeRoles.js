export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.roleId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

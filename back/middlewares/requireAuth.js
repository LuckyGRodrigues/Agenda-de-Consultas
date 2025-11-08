module.exports = function requireAuth(req, res, next) {
  if (req.session && req.session.clientId) {
    return next();
  }
  return res.status(404).json({ error: 'Endereço não encontrado' });
};

const AppError = require("../utils/erroPadrao");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const [scheme, token] = authorization ? authorization.split(" ") : [];

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Token de autenticação não informado ou inválido.", 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.id) {
      return next(new AppError("Token de autenticação inválido.", 401));
    }

    req.usuarioId = payload.id;
    next();
  } catch (error) {
    return next(new AppError("Token de autenticação inválido ou expirado.", 401));
  }
};

module.exports = authMiddleware;

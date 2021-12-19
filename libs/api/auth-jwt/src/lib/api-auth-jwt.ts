import jwt from 'jsonwebtoken';

const SECRET = process.env.TOKEN_SECRET || 'dev-secret';
export function generateAccessToken(userId: string) {
  return jwt.sign(userId, SECRET);
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader || authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

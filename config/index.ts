export const config = {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  }
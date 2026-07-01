const isLocalhost = process.env.NODE_ENV !== 'production';

module.exports = {
  isLocalhost,
  cookieName: 'token',
  cookieOptions: {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: isLocalhost ? 'Lax' : 'None',
    path: '/',
    maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
  },
};

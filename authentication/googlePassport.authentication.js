const passport = require('passport');
const { loggedin } = require('../utils/registerLoginUtils');

const frontendUrl = process.env.FRONTEND_URL || 'https://leavemanagementfrontend.vercel.app/leavo';

const startGoogleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
  session: false,
});

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (error, userData, info) => {
    if (error) {
      return next(error);
    }

    if (!userData) {
      const message = encodeURIComponent(info?.message || 'Google authentication failed');
      return res.redirect(`${frontendUrl}/login?authError=${message}`);
    }

    const token = loggedin(userData);
    const redirectPath =
      userData.email === process.env.ADMIN_COLLEGE_EMAIL ? '/adminDashboard' : '/dashboard';

    return res.redirect(
      `${frontendUrl}/login?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(
        redirectPath,
      )}`,
    );
  })(req, res, next);
};

module.exports = { startGoogleAuth, googleAuthCallback };

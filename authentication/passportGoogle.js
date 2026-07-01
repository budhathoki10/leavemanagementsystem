const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const user = require('../models/user.models');

const configureGooglePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(null, false, { message: 'Google account has no email address' });
          }

          let userData = await user.findOne({ email });

          if (!userData) {
            userData = new user({
              studentname: profile.displayName || 'john doe',
              email,
            });
            await userData.save();
          }

          return done(null, userData);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
};

module.exports = configureGooglePassport;

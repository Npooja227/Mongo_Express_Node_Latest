const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

const user = require('./models/user');

const JWT_SECRET = 'DA693C13E7C5528473D915EB827EC';

//Check if given token is valid
passport.use(new JWTStrategy({

    jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromAuthHeaderAsBearerToken(), ExtractJWT.fromUrlQueryParameter('token')]),
    secretOrKey: JWT_SECRET

}, async (payload, done) => {

        try {
            console.log(payload);
            //check if user exists by specific id
            const checkUser = await user.findById(payload.user_id);

            //If user doesn't exist, handle it
            if (!checkUser) return done(null, false);

            //otherwise, return the user
            done(null, checkUser);
        }
        catch (error) {
            done(error, false);
        }
}));


//Local Startegy for Login
passport.use(new LocalStrategy({

    usernameField: 'email'

}, async (email, password, done) => {

        try {

            //check if user exists by email
            const User = await user.findOne({ email });

            //If user doesn't exists, handle it
            if (!User) return done(null, false);

            //Check If the password is correct
            const isMatch = await User.isValidPassword(password);
            
            //If not, Handle it
            if (!isMatch) return done(null, false);

            //Otherwise, return the user
            done(null, User);
        }
        catch (error) {
            done(error,false);
        }
    }));


//Google Passport Strategy for Google OAuth
/*passport.use(new GoogleStrategy({
    consumerKey: GOOGLE_CONSUMER_KEY,
    consumerSecret: GOOGLE_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
}, async (token, tokenSecret, profile, done) => {
}));*/


//Google Passport Strategy for Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: '339491989796-g2e8ail1flkcsc3d8d5sn0nlaif806kr.apps.googleusercontent.com',
    clientSecret: 'xgM1vAwUh_85IlUiPR8q9IlC',
    callbackURL: "http://localhost:8080/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
        
        try {
            //Check if user exists by email
            const existingUser = await user.findOne({ 'email': profile.emails[0].value });
            
            //If user already existing
            if (existingUser) {
                const checkUser = await user.findOne({ 'email': profile.emails[0].value, 'provider.google': profile.id });
                
                if (checkUser) return done(null, existingUser);
                else return done(null, false);
            }

            //If new account
            const newUser = new user({
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: {
                    google: profile.id
                },
                image: profile.photos[0].value
            });

            await newUser.save();

            done(null, newUser);
        } catch (error) {
            done(error, false, error.message);
        }
}));


//Facebook Passport Strategy for Facebook OAuth
passport.use(new FacebookStrategy({
    clientID: '763996940767820',
    clientSecret: '091f7630996bc242bc5e9f6286343e57',
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async (accessToken, refreshToken, profile, done) => {

    try {

        //Check if user exists by email
        const existingUser = await user.findOne({ 'email': profile.emails[0].value });
        
        //If user already existing
        if (existingUser) {
            const checkUser = await user.findOne({ 'email': profile.emails[0].value, 'provider.facebook': profile.id });
            
            if (checkUser) return done(null, existingUser);
            else return done(null, false);
        }

        //If new account
        const newUser = new user({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: {
                facebook: profile.id
            },
            image: profile.photos[0].value
        });

        await newUser.save();

        //Otherwise, return the user
        done(null, newUser);
    }
    catch (error) {
        done(error, false);
    }
}));


//Twitter Passport Strategy for Twitter OAuth
/*passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
}, async (token, tokenSecret, profile, done) => {
}));*/


//GitHub Passport Strategy for GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: 'b39ef72675dfca7cda16',
    clientSecret: '297c004a3301fc41d5e648a3c72ca26e1dd95e90',
    callbackURL: "http://localhost:8080/auth/github/callback",
    scope: 'user:email'
}, async (accessToken, refreshToken, profile, done) => {

        try {
            const exisitingUser = await user.findOne({ email: profile.emails[0].value });

            //If user already existing
            if (exisitingUser) {
                const checkUser = await user.findOne({ email: profile.emails[0].value, 'provider.github': profile.id });

                if (checkUser) done(null, exisitingUser);
                else done(null, error);
            }

            //If new account
            const newUser = new user({
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: {
                    github: profile.id
                },
                image: profile.photos[0].value
            });

            await newUser.save();

            //Otherwise, return the user
            done(null, newUser);
        }
        catch (error) {
            done(error, false);
        }
}));


//LinkedIn Passport Strategy for LinkedIn OAuth
passport.use(new LinkedInStrategy({
    clientID: '81bp1qmf3vrwsn',
    clientSecret: 'UGZ00oVmEQWIDqYw',
    callbackURL: "http://localhost:8080/auth/linkedin/callback",
    scope: ['r_liteprofile', 'r_emailaddress']
}, async (token, tokenSecret, profile, done) => {
        console.log(profile);
        try {
            const exisitingUser = await user.findOne({ email: profile.emails[0].value });

            //If user already existing
            if (exisitingUser) {
                const checkUser = await user.findOne({ email: profile.emails[0].value, 'provider.linkedin': profile.id });

                if (checkUser) done(null, exisitingUser);
                else done(null, false);
            }

            //If new account
            const newUser = new user({
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: {
                    github: profile.id
                },
                image: profile.photos[0].value
            });

            await newUser.save();

            //Otherwise, return the user
            done(null, newUser);
        }
        catch (error) {
            done(error, false);
        }
}));
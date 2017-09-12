import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import schema from './data/schema';
import  cors  from 'cors';

var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new FacebookTokenStrategy({
    clientID: "620636164812861",
    clientSecret: "21052e82f0178813dec2c37538a85ba5",
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

const GRAPHQL_PORT = 3000;

const graphQLServer = express();

//FIXES CORS ERROR
var whitelist = [
    'http://localhost:8100',
    'http://localhost:8101',
    'http://hispot.camdvr.org:8100',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
graphQLServer.use(cors(corsOptions));
// -->
// graphQLServer.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
graphQLServer.use(require('morgan')('combined'));
graphQLServer.use(require('cookie-parser')());
graphQLServer.use(require('body-parser').urlencoded({ extended: true }));
graphQLServer.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
graphQLServer.use(passport.initialize());
graphQLServer.use(passport.session());

// Define routes.
graphQLServer.get('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    // do something with req.user
    console.log("Facbook login", req.user);
    res.sendStatus(req.user? 200 : 401);
  }
);

graphQLServer.use('/graphql',
                  // passport.authenticate('facebook-token'),
                  bodyParser.json(),
                  graphqlExpress(request => ({
                    schema: schema,
                    context: { user: request.user, accessToken: request.headers.access_token }
                  })));
                                                                            
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));

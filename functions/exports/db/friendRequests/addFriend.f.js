'use strict';

module.exports = ({ admin, cors, express, functions }) => {
  const app = express();

  app.use(cors({ origin: true }));

  app.use((req, res, next) => {
    console.log('HEADERS:', req.headers);
    if (!req.headers.authorization) return res.status(403).json({ message: 'Missing Authorization Header' });

    let jwt = req.headers.authorization.trim();

    return admin.auth().verifyIdToken(jwt).then((claims) => {
      req.user = claims; // gives us a user object to use below
      next();
    }).catch((err) => {
      return res.status(400).json({
        message: 'Invalid JWT'
      });
    });
  });

  app.post('/api/v1/friend-requests/', (req, res) => {
    console.log('Friend Requested');
    console.log('request body:', req.body);
    console.log('requester:', req.user);
    res.send({message: 'Friend Requested!'});
  });

  return functions.https.onRequest(app);
};

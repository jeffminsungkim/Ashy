'use strict';

module.exports = ({ admin, cors, express, functions }) => {
  const app = express();
  const fireStore = admin.firestore();
  const db = fireStore.collection('friendReqeusts');

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

  app.post('/', (req, res) => {
    const recipientId = req.body.uid;
    const frRef = db.doc(recipientId).collection('receiveFrom').doc(req.user.user_id);
    console.log('request body:', req.body);
    console.log('requester:', req.user);
    frRef.set({
      uid: req.user.user_id,
      displayName: req.user.name,
      photoURL: req.user.picture,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: "Let's be friends!"
    }).then(() => {
      res.status(201).send({message: 'Friend Requested!'});
    }).catch((error) => console.log("Error writing document: ", error));
  });

  return functions.https.onRequest(app);
};

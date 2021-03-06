'use strict';

module.exports = ({ admin, cors, express, functions }) => {
  const app = express();
  const fireStore = admin.firestore();
  const rtdb = admin.database();
  const apps = fireStore.collection('apps');
  const users = fireStore.collection('users');

  app.use(cors({ origin: true }));

  app.use((req, res, next) => {
    if (!req.headers.authorization) return res.status(403).json({ message: 'Missing Authorization Header' });

    const jwt = req.headers.authorization.trim();

    return admin.auth().verifyIdToken(jwt).then((claims) => {
      req.user = claims;
      next();
    }).catch((err) => {
      return res.status(400).json({
        message: 'Invalid JWT'
      });
    });
  });

  app.post('/', (req, res) => {
    const batch = admin.firestore().batch();
    const uid = req.user.user_id;
    const data = req.body;
    const appsRef = apps.doc(uid);
    const usersRef = users.doc(uid);

    const activityState = {
      currentActiveStatus: data.activityState.currentActiveStatus,
      usingApp: data.activityState.usingApp
    };

    const appState = {
      emailVerified: data.user.emailVerified
    };

    const userState = {
      displayName: data.user.displayName,
      photoURL: data.user.photoURL,
      currentActiveStatus: data.user.currentActiveStatus,
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    };

    batch.update(appsRef, appState);
    batch.update(usersRef, userState);

    let dbfs = batch.commit().then(() => console.log('Batch commit finished!'));
    let rtDb = admin.database().ref(`status/${uid}`).update(activityState).then(() => console.log('RTDB update finished!'));

    return Promise.all([rtDb, dbfs]).then(() => {
      res.status(200).send({ message: 'Successfully Initialize Default State' });
    });
  });

  return functions.https.onRequest(app);
};

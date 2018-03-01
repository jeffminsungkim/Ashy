'use strict';

module.exports = ({ admin, functions, firestore, fs, gcs, mkdirp, os, path, spawn }) => {
  return functions.storage.object().onChange((event) => {
    const THUMB_PREFIX = 'thumb_';
    const THUMB_MAX_HEIGHT = 120;
    const THUMB_MAX_WIDTH = 120;
    const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/';
    const contentType = event.data.contentType; // This is the image Mimme type ex) image/jpeg
    const filePath = event.data.name; // A full path including a file name ex) user-profile/qcjPTIR28CY3AzPD4K4E6Mk8zeF3.jpeg
    const fileDir = path.dirname(filePath); // Directory path ex) user-profile/
    const fileName = path.basename(filePath); // ex) qcjPTIR28CY3AzPD4K4E6Mk8zeF3.jpeg
    const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`)); // ex) user-profile/thumb_qcjPTIR28CY3AzPD4K4E6Mk8zeF3.jpeg
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
    // const uid = fileName.split(".")[0];
    const uid = fileDir.split('/').pop(); // split() converts a string into an array
    const userRef = firestore.doc(`users/${uid}`);
    const batch = admin.firestore().batch();

    console.log('event data:', event.data);
    console.log('resource state:', event.data.resourceState);

    if (event.data.resourceState === 'exists' && event.data.metageneration > 1) {
      console.log('This is a metadata change event.');
      return null;
    }

    if (!contentType.startsWith('image/')) {
      console.log('This is not an image type.');
      return null;
    }

    if (fileName.startsWith(THUMB_PREFIX) || uid.startsWith(THUMB_PREFIX)) {
      console.log('Already a thumbnail.');
      return null;
    }

    if (event.data.resourceState === 'not_exists') {
      console.log('This is a deletion event.');
      const urls = {
        photoURL: null,
        thumbnailURL: null
      };
      batch.update(userRef, urls);
      return batch.commit().then(() => {
        console.log('Use Identicon.');
        console.log('resource state2:', event.data.resourceState);
      });
    }

    // Cloud Storage files.
    const bucketId = event.data.bucket; // ex) ashy-development.appspot.com
    const token = event.data.metadata.firebaseStorageDownloadTokens;
    // event.data.selfLink ex) https://www.googleapis.com/storage/v1/b/ashy-development.appspot.com/o/user-profile%2FVyFdopAiWKXvGqEJtrX3FYFlfIP2%2FVyFdopAiWKXvGqEJtrX3FYFlfIP2.jpeg
    // const originalImageUrl = event.data.selfLink + '?alt=media&token=' + token;
    const originalImageUrl = BASE_URL + bucketId + "/o/" +  encodeURIComponent(filePath) + '?alt=media&token=' + token;
    const bucket = gcs.bucket(event.data.bucket);
    const file = bucket.file(filePath);
    const thumbFile = bucket.file(thumbFilePath);
    const metadata = {
      contentType: contentType,
      metadata: {
        firebaseStorageDownloadTokens: token
      }
    };

    // Create the temp directory where the storage file will be downloaded.
    return mkdirp(tempLocalDir).then(() => {
      // Download file from bucket.
      return file.download({destination: tempLocalFile});
    }).then(() => {
      console.log('The file has been downloaded to', tempLocalFile);
      // Generate a thumbnail using ImageMagick.
      return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
    }).then(() => {
      console.log('Thumbnail created at', tempLocalThumbFile);
      // Uploading the thumbnail.
      return bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
    }).then(() => {
      console.log('Thumbnail uploaded to Storage at', thumbFilePath);
      // Once the image has been uploaded delete the local files to free up disk space.
      fs.unlinkSync(tempLocalFile);
      fs.unlinkSync(tempLocalThumbFile);

      return Promise.resolve(BASE_URL + bucketId + "/o/" + encodeURIComponent(thumbFile.name) + "?alt=media&token=" + token);
    }).then((thumbnailUrl) => {
      console.log('Got Thumbnail URL!', thumbnailUrl);

      // Add the URLs to the Firestore.
      const photoURLs = {
        photoURL: originalImageUrl,
        thumbnailURL: thumbnailUrl
      };

      batch.update(userRef, photoURLs);
      return batch.commit().then(() => console.log('Photo URLs saved to Firestore!'));
    });
  });
};

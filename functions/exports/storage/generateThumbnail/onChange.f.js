'use strict';

module.exports = ({ admin, functions, firestore, fs, gcs, mkdirp, os, path, spawn }) => {
  return functions.storage.object().onChange((event) => {
    const THUMB_PREFIX = 'thumb_';
    const THUMB_MAX_HEIGHT = 200;
    const THUMB_MAX_WIDTH = 200;
    const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/ashy-dev-3662f.appspot.com/o/avatar-placeholder%2F';
    const ORIGINAL_PLACEHOLDER = `${BASE_URL}avatar.jpg?alt=media&token=210aa481-209b-4374-a494-13bdbdc17b54`;
    const THUMBNAIL_PLACEHOLDER = `${BASE_URL}thumb_avatar.jpg?alt=media&token=0e1d9733-a87d-4bf7-be4a-072dd1c20c50`;
    const contentType = event.data.contentType; // This is the image Mimme type
    const filePath = event.data.name; // A full path including a file name
    const fileDir = path.dirname(filePath); // Directory path ex) profile-pictures/tWB4bLrVqsSGAAQf7pQGTlbS3oy2
    const fileName = path.basename(filePath);
    const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
    const uid = fileDir.split('/').pop(); // split() converts a string into an array
    const userRef = firestore.doc(`users/${uid}`);
    const batch = admin.firestore().batch();

    // Cloud Storage files.
    const bucket = gcs.bucket(event.data.bucket);
    const file = bucket.file(filePath);
    const thumbFile = bucket.file(thumbFilePath);
    const metadata = { contentType: contentType };
    console.log('resource state:', event.data.resourceState);

    if (event.data.resourceState === 'not_exists') {
      console.log('This is a deletion event.');
      const urls = {
        photoURL: ORIGINAL_PLACEHOLDER,
        thumbnailURL: THUMBNAIL_PLACEHOLDER
      };
      batch.update(userRef, urls);
      return batch.commit().then(() => {
        console.log('Use default placeholder.');
        console.log('resource state2:', event.data.resourceState);
      });
    }

    if (!contentType.startsWith('image/')) {
      console.log('This is not an image type.');
      return null;
    }

    if (fileName.startsWith(THUMB_PREFIX)) {
      console.log('Already a thumbnail.');
      return null;
    }

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
      return bucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata });
    }).then(() => {
      console.log('Thumbnail uploaded to Storage at', thumbFilePath);
      // Once the image has been uploaded delete the local files to free up disk space.
      fs.unlinkSync(tempLocalFile);
      fs.unlinkSync(tempLocalThumbFile);
      // Get the Signed URLs for the thumbnail and original image.
      const config = {
        action: 'read',
        expires: '03-01-2500'
      };
      return Promise.all([
        thumbFile.getSignedUrl(config),
        file.getSignedUrl(config)
      ]);
    }).then(results => {
      console.log('Got Signed URLs!');
      const thumbResult = results[0];
      const originalResult = results[1];
      const thumbFileUrl = thumbResult[0];
      const fileUrl = originalResult[0];
      // Add the URLs to the Firestore.
      const photoURLs = {
        photoURL: fileUrl,
        thumbnailURL: thumbFileUrl
      };
      batch.update(userRef, photoURLs);
      return batch.commit().then(() => console.log('Photo URLs saved to Firestore!'));
    });
  });
};

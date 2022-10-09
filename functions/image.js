const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mkdirp = require('mkdirp-promise');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const sharp = require('sharp');
sharp.cache(false);

// File extension for the created JPEG files.
const JPEG_EXTENSION = '.jpg';

exports.shrinkImage = functions.storage.object().onFinalize(async object => {
  const filePath = object.name;
  const baseFileName = path.basename(filePath, path.extname(filePath));
  const fileDir = path.dirname(filePath);
  const JPEGFilePath = path.normalize(
    path.format({ dir: fileDir, name: baseFileName, ext: JPEG_EXTENSION }),
  );
  const shrink = path.normalize(
    path.format({
      dir: fileDir,
      name: baseFileName + '_thumb',
      ext: JPEG_EXTENSION,
    }),
  );
  const tempShrink = path.join(os.tmpdir(), shrink);
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);

  const alreadyShrunk = (object.metadata || {}).shrunk;

  // Exit if this is triggered on a file that is not an image.
  if (!object.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  // Exit if the image is already a JPEG.
  if (alreadyShrunk) {
    console.log('Already shrunken.');
    return null;
  }

  const bucket = admin.storage().bucket(object.bucket);
  await mkdirp(tempLocalDir);
  await fs.ensureDir(tempLocalDir);

  // Download file from bucket.
  await bucket.file(filePath).download({ destination: tempLocalFile });

  await sharp(tempLocalFile).rotate().resize(400, 400).toFile(tempShrink);

  // Uploading the JPEG image.
  await bucket.upload(tempShrink, {
    destination: JPEGFilePath,
    metadata: {
      metadata: {
        shrunk: true,
      },
    },
  });
  // console.log('JPEG image uploaded to Storage at', JPEGFilePath);

  // Once the image has been converted delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempShrink);
  return null;
});

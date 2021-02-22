import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';
import {
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_Uploaded_File_URL_LINK,
} from '../config';
import Recipe from '../models/recipe';

// S3 upload method returns error and data in a callback, where data contains
// location, bucket, and key of the uploaded file.
const recipeRoutes = express.Router();

const storage = multer.memoryStorage();

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'images');
//   },
//   filename(req, file, cb) {
//     // cb(null, Date.now() + path.extname(file.originalname));
//     cb(null, `${file.fieldname}-${Date.now()}`);
//   },
// });

// recipeRoutes.post('/upload', upload.single('file'), async (req, res) => {
//   const { file } = req;
//   const s3FileURL = AWS_Uploaded_File_URL_LINK;

//   const s3bucket = new AWS.S3({
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//     region: AWS_REGION,
//   });

//   const params = {
//     Bucket: AWS_BUCKET_NAME,
//     Key: file.originalname,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'public-read',
//   };

//   s3bucket.upload(params, (err, data) => {
//     if (err) {
//       res.status(500).json({ error: true, Message: err });
//     } else {
//       res.send({ data });
//       const newFileUploaded = {
//         description: req.body.description,
//         fileLink: s3FileURL + file.originalname,
//         s3_key: params.Key,
//       };
//       const document = new Document(newFileUploaded);
//       document.save((err, newFile) => {
//         if (error) {
//           throw error;
//         }
//       });
//     }
//   });
// });

recipeRoutes.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
    console.log('Successfully retrieved recipes!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipes = await Recipe.findById(id);
    if (recipes) {
      res.status(200).json(recipes);
      console.log(`Successfully retrieved recipe ${id}!`);
    } else {
      res.status(404).json({ message: 'No valid entry found!' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// Check File Type
const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Images Only!');
};

const s3bucket = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const upload = multer({
  fileFilter,
  limits: { fileSize: 10000000 },
  storage: multerS3({
    acl: 'public-read',
    s3: s3bucket,
    bucket: AWS_BUCKET_NAME,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      // common practice to add Date.now() to make id/key unique
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

const singleUpload = upload.single('image');
const multipleUpload = upload.array('image', 5);

recipeRoutes.post('/add-pic', async (req, res) => {
  // const newRecipe = new Recipe(req.body);  // at this point, req.body has nothing!
  try {
    await singleUpload(req, res, (err) => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: 'Image upload error',
            detail: err.message,
            error: err,
          },
        });
      }
      const update = { image: req.file.location };
      const newRecipe = new Recipe(req.body);
      try {
        newRecipe.save()
          .then(() => res.status(200).json({ message: 'Successfully added image!' }))
          .catch((e) => res.status(400).json({ success: false, error: e }));
      } catch (error) {
        res.status(500).json({ message: error });
      }
      console.log(req.body); // gests key values correct except image is an object: null
      console.log(req.params);
      console.log(req.file); // gets stuff about file/image
      console.log('Successfully added image!');
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.put('/add-pics/:id', async (req, res) => {
  const uid = req.params.id;
  try {
    await multipleUpload(req, res, (err) => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: 'Image uploads error',
            detail: err.message,
            error: err,
          },
        });
      }

      try {
        const img_urls = req.files
          .map((item) => item.location);
        const update = req.body;
        update.images = img_urls;
        Recipe.updateOne(
          { _id: uid },
          update,
        )
          .then(() => res.status(200).json({ message: 'Successfully added image!' }))
          .catch((e) => res.status(400).json({ success: false, error: e }));
        console.log('Successfully added image!');
      } catch (error) {
        res.status(500).json({ message: error });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.put('/add-pic/:id', async (req, res) => {
  const uid = req.params.id;
  try {
    await singleUpload(req, res, (err) => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: 'Image upload error',
            detail: err.message,
            error: err,
          },
        });
      }
      const update = req.body;
      update.image = req.file.location;
      const updatedRecipe = Recipe.updateOne(
        { _id: uid },
        update,
      //   {
      //   // $set: { title: req.body.title }
      //   $set: req.body,
      // }
      )
        .then(() => res.status(200).json({ message: 'Successfully added image!' }))
        .catch((e) => res.status(400).json({ success: false, error: e }));
      console.log('Successfully added image!');
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.post('/add', async (req, res) => {
  const newRecipe = new Recipe(req.body);
  try {
    // const { file } = req;
    // const s3FileURL = AWS_Uploaded_File_URL_LINK;

    // const s3bucket = new AWS.S3({
    //   accessKeyId: AWS_ACCESS_KEY_ID,
    //   secretAccessKey: AWS_SECRET_ACCESS_KEY,
    //   region: AWS_REGION,
    // });

    // const params = {
    //   Bucket: AWS_BUCKET_NAME,
    //   Key: file.originalname,
    //   Body: file.buffer,
    //   ContentType: file.mimetype,
    //   ACL: 'public-read',
    // };

    // s3bucket.upload(params, (err, data) => {
    //   if (err) {
    //     res.status(500).json({ error: true, Message: err });
    //   } else {
    //     res.send({ data });
    //     const newFileUploaded = {
    //       description: req.body.description,
    //       fileLink: s3FileURL + file.originalname,
    //       s3_key: params.Key,
    //     };
    //     // const document = new Recipe(newFileUploaded);
    //     // document.save((err, newFile) => {
    //     //   if (error) {
    //     //     throw error;
    //     //   }
    //     // });
    //   }
    // });
    await newRecipe.save();
    res.status(201).json({ message: 'Recipe POST request successful!' });
    console.log('Successfully added recipe!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// app.post('/upload', upload.single('file'), function (req, res, next) {
//     console.log('Uploaded!');
//     res.send(req.file);
// });
// Case 2: When we are using .array(fieldname[, maxCount]) method it will return file object in req.files

// app.post('/upload', upload.array('file', 1), function (req, res, next) {
//     console.log('Uploaded!');
//     res.send(req.files);
// });

// https://stackoverflow.com/questions/22071434/mongodb-update-collection-field-if-new-value-is-not-null
// https://wanago.io/2020/04/27/typescript-express-put-vs-patch-mongodb-mongoose/
// typically, patch only updates new fields while put updates the entire document
// however, the $set operator allows us to specify which fields to update
recipeRoutes.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.updateOne(
      { _id: id },
      {
        $set: req.body,
      },
    );
    console.log(req.body);
    res.status(200).json({ message: 'Successfully updated recipe!' });
    console.log('Successfully updated recipe!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.put('/update1/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecipe = await Recipe.updateOne(
      { _id: id },
      {
        // $set: { title: req.body.title }
        $set: req.body,
      },
    );
    res.status(200).json({ message: 'Successfully updated recipe!' });
    console.log('Successfully updated recipe!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const removedRecipe = await Recipe.deleteOne({ _id: id });

    const s3bucket = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
    });

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: result.s3_key,
    };

    s3bucket.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          status: '200',
          responseType: 'string',
          response: 'success',
        });
      }
    });

    res.status(200).json({ message: 'Successfully removed recipe!' });
    console.log('Successfully deleted recipe!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default recipeRoutes;

/*
// good example for adding profile pic
const upload = require("../services/ImageUpload");
const singleUpload = upload.single("image");

router.post("/:id/add-profile-picture", function (req, res) {
  const uid = req.params.id;

  singleUpload(req, res, function (err) {
    if (err) {
      return res.json({
        success: false,
        errors: {
          title: "Image Upload Error",
          detail: err.message,
          error: err,
        },
      });
    }

    let update = { profilePicture: req.file.location };

    User.findByIdAndUpdate(uid, update, { new: true })
      .then((user) => res.status(200).json({ success: true, user: user }))
      .catch((err) => res.status(400).json({ success: false, error: err }));
  });
});
*/

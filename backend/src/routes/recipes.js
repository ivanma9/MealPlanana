import express from 'express';
import multer from 'multer';

import {
  s3bucket, recipeUploader,
} from '../util/aws-helpers';

import {
  AWS_BUCKET_NAME,
} from '../config';

import Recipe from '../models/recipe';

const recipeRoutes = express.Router();

// get all recipes
recipeRoutes.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
    console.log('Successfully retrieved recipes!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// get one recipe (specific ID)
recipeRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (recipe) {
      res.status(200).json(recipe);
      console.log(`Successfully retrieved recipe ${id}!`);
    } else {
      res.status(404).json({ message: 'Recipe not found!' });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

recipeRoutes.post('/add', recipeUploader, async (req, res) => {
  try {
    const update = req.body;

    // only add files/pics if there are any
    if (req.files) {
      const { preview, images } = req.files;
      if (preview) {
        console.log('preview image being added');
        update.preview = {
          location: preview[0].location,
          key: preview[0].key,
        };
      }
      if (images) {
        console.log('image(s) being added');
        const imgUrls = images
          .map((image) => ({
            location: image.location,
            key: image.key,
          }));
        update.images = imgUrls;
      }
    }

    const newRecipe = new Recipe(update);
    await newRecipe.save();
    res.status(200).json({ message: 'Successfully added recipe!' });
    console.log('Successfully added recipe!');
  } catch (err) {
    if (err instanceof multer.MulterError) {
      console.log('multer oopsie in recipe creation');
      return res.json({
        success: false,
        errors: {
          title: 'Image upload error',
          detail: err.message,
          error: err,
        },
      });
    }
    res.status(500).json({ message: err });
  }
});

// https://stackoverflow.com/questions/22071434/mongodb-update-collection-field-if-new-value-is-not-null
// https://wanago.io/2020/04/27/typescript-express-put-vs-patch-mongodb-mongoose/
// typically, patch only updates new fields while put updates the entire document
// however, the $set operator allows us to specify which fields to update
recipeRoutes.put('/update/:id', recipeUploader, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    // only if files/images involved
    if (req.files) {
      const { preview, images } = req.files;
      if (preview) {
        update.preview = {
          location: preview[0].location,
          key: preview[0].key,
        };
      }
      if (images) {
        const imgUrls = images
          .map((image) => ({
            location: image.location,
            key: image.key,
          }));
        update.images = imgUrls;
      }
    }
    await Recipe.updateOne(
      { _id: id },
      {
        $set: update,
      },
    );
    res.status(200).json({ message: 'Successfully updated recipe!' });
    console.log('Successfully added recipe!');
  } catch (err) {
    if (err instanceof multer.MulterError) {
      console.log('multer oopie');
      return res.json({
        success: false,
        errors: {
          title: 'Image upload error',
          detail: err.message,
          error: err,
        },
      });
    }
    res.status(500).json({ message: err });
  }
});

recipeRoutes.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Couldn't find the recipe" });
    }
    const { preview, images } = recipe;

    // delete preview from s3 if exists
    if (preview) {
      s3bucket.deleteObject(
        { Bucket: AWS_BUCKET_NAME, Key: preview.key },
        (err, data) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
          console.log('Successfully deleted preview');
        },
      );
    }

    // delete images from s3 if exists
    if (images) {
      images.forEach(async (image) => {
        await s3bucket.deleteObject(
          { Bucket: AWS_BUCKET_NAME, Key: image.key },
          (err, data) => {
            if (err) {
              return res.status(500).json({ message: err });
            }
            console.log('Successfully deleted an image');
          },
        );
      });
    }

    await Recipe.deleteOne({ _id: id });
    res.status(200).json({ message: 'Successfully removed recipe!' });
    console.log('Successfully deleted recipe from mongodb and aws!!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

export default recipeRoutes;

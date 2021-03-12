import express from 'express';
import multer from 'multer';

import {
  s3bucket, recipeUploader,
} from '../util/aws-helpers';

import {
  AWS_BUCKET_NAME,
} from '../config';
import { checkRes } from '../util/helpers';
import Recipe from '../models/recipe';

const recipeRoutes = express.Router();

// get all recipes
recipeRoutes.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    return checkRes(res, recipes, true, 'Successfully retrieved recipes!');
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// get one recipe (specific ID)
recipeRoutes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    return checkRes(res, recipe, true, 'Successfully retrieved recipe!', 'Recipe not found!');
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
    return checkRes(res, newRecipe, true, 'Successfully added recipe!', 'Something went wrong!');
  } catch (err) {
    if (err instanceof multer.MulterError) {
      console.log('multer did an oopsie in recipe creation');
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
    const { ingredients, tags } = req.body;
    const recipe = await Recipe.findById(id);
    const oldPreview = recipe.preview;
    const oldImages = recipe.images;

    // only if files/images involved
    if (req.files) {
      const { preview, images } = req.files;
      // Make sure preview exists, and isn't just a string with value 'null'
      if (preview !== undefined) {
        if (typeof preview[0] !== 'string' && preview[0] !== 'null') {
          update.preview = {
            location: preview[0].location,
            key: preview[0].key,
          };
        } else {
          update.preview = {};
        }
        if (oldPreview) {
          s3bucket.deleteObject(
            { Bucket: AWS_BUCKET_NAME, Key: oldPreview.key },
            (err, data) => {
              if (err) {
                return res.status(500).json({ message: err });
              }
              console.log('Successfully deleted preview');
            },
          );
        }
      }
      if (images) {
        if (images.length === 0 || (images.length === 1 && (!images[0] || images[0] === 'null'))) {
          update.images = [];
        } else {
          const imgUrls = images
            .map((image) => {
              if (image && typeof image !== 'string' && image !== 'null') {
                return {
                  location: image.location,
                  key: image.key,
                };
              }
            });
          update.images = imgUrls;
        }
        if (oldImages) {
          oldImages.forEach(async (image) => {
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
      }
    }

    if (ingredients) {
      if (ingredients.length === 0 || !ingredients[0]) {
        update.ingredients = [];
      }
    }

    if (tags) {
      if (tags.length === 0 || !tags[0]) {
        update.tags = [];
      }
    }

    await Recipe.updateOne(
      { _id: id },
      {
        $set: update,
      },
    );
    console.log('Successfully added recipe!');
    return res.status(200).json({ message: 'Successfully updated recipe!' });
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
    return res.status(500).json({ message: err });
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

// search query in URL
recipeRoutes.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    // empty query -- get all recipes
    if (!query) {
      console.log('Getting all recipes');
      const recipe = await Recipe.find();
      return checkRes(res, recipe, true, 'Retrieved all recipes!');
    }
    const { option, search } = query;
    const recipePattern = new RegExp(`${search}`);

    // default search title
    if (!option || option.toLowerCase() === 'title') {
      const recipe = await Recipe.find({
        title: { $regex: recipePattern, $options: 'i' },
      });
      return checkRes(res, recipe, true, 'Completed query by title!');
    }

    // search by user
    if (option.toLowerCase() === 'user') {
      const recipe = await Recipe.find({
        'author.username': { $regex: recipePattern, $options: 'i' },
      });
      return checkRes(res, recipe, true, 'Completed query by user!');
    }

    const tag = [new RegExp(`^${search}`, 'i')];

    // search by tag
    if (option.toLowerCase() === 'tag') {
      const recipe = await Recipe.find({
        tags: { $all: tag },
      });
      return checkRes(res, recipe, true, 'Completed query by tag!');
    }

    // search by all 3 options
    if (option.toLowerCase() === 'all') {
      const recipe = await Recipe.find({
        title: { $regex: recipePattern, $options: 'i' },
        'author.username': { $regex: recipePattern, $options: 'i' },
        tags: { $all: tag },
      });
      return checkRes(res, recipe, true, 'Completed query by all 3 options!');
    }

    res.status(400).json({ message: 'bad request' });
  } catch (err) {
    console.log('Query Error!');
    res.status(500).json({ message: err });
  }
});

export default recipeRoutes;

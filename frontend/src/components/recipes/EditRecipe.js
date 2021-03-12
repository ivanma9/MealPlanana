/* eslint no-undef: 0 */ // --> OFF

import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import ChipInput from 'material-ui-chip-input';
import { Editor } from '@tinymce/tinymce-react';
import { Form } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Schema } from 'mongoose';
import {
  deleteRecipe, updateRecipe, removeRecipeFromStateOnUnselected, fetchRecipe,
} from '../../actions/recipes';
import LoadingPage from '../LoadingPage';

const sanitizeHtml = require('sanitize-html');

const mapStateToProps = (state) => ({
  recipe: state.currentRecipe.item,
  loading: state.currentRecipe.loading,
  error: state.currentRecipe.error,
});

let editSuccessful = false;

class EditRecipe extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onAddIngredient = this.onAddIngredient.bind(this);
    this.onBeforeAddIngredient = this.onBeforeAddIngredient.bind(this);
    this.onDeleteIngredient = this.onDeleteIngredient.bind(this);
    this.onChangeDirections = this.onChangeDirections.bind(this);
    this.onAddTag = this.onAddTag.bind(this);
    this.onBeforeAddTag = this.onBeforeAddTag.bind(this);
    this.onDeleteTag = this.onDeleteTag.bind(this);
    this.onChangePreview = this.onChangePreview.bind(this);
    // this.onChangeImages = this.onChangeImages.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      title: '',
      description: '',
      ingredients: [],
      directions: '',
      tags: [],
      preview: {},
      // images: [],

      titleIsEmpty: false,
      previewChanged: false,
      // imagesChanged: false,
      // imagesToDelete: [],
      // imagesToAdd: [],
      deleteDialogOpen: false,
      ingredientIsDuplicate: false,
      tagIsDuplicate: false,
    };
  }

  componentDidMount() {
    if (this.props.history.location.appState !== undefined) {
      this.setState({ appState: this.props.history.location.appState });
    }

    if (this.props.recipe) {
      this.setState({
        title: this.props.recipe.title,
        description: this.props.recipe.description,
        ingredients: this.props.recipe.ingredients,
        directions: this.props.recipe.directions,
        tags: this.props.recipe.tags,
        preview: this.props.recipe.preview,
        // images: this.props.recipe.images,
      });
    }
    window.scrollTo(0, 0); //* scrolls window to top of the page, instant
  }

  // TODO: fix when refresh and want to go back?
  // TODO: fix when you go back to View but then go forward to Edit.
  componentWillUnmount() {
    if ( //* if back button wasn't pressed and edit wasn't pressed, remove the recipe from state
      this.props.history.action !== 'POP'
      || this.state.appState === undefined
      || !this.state.appState.editPressed
    ) {
      this.props.removeRecipeFromStateOnUnselected();
    }
  }

  // TODO: add checking for correct number of images here
  handleValidation() { //* makes sure title field isn't empty
    let formIsValid = true;

    const { title } = this.state;

    if (title.length === 0) {
      this.setState({ titleIsEmpty: true });
      formIsValid = false;
    } else this.setState({ titleIsEmpty: false });

    return formIsValid;
  }

  handleDeleteDialogYes = () => {
    this.setState({ deleteDialogOpen: false });
    this.props.deleteRecipe(this.props.recipe._id);
    this.props.history.push({
      pathname: '/recipes',
    });
  }

  handleDeleteDialogNo = () => {
    this.setState({ deleteDialogOpen: false });
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });

    if (e.target.value.length === 0) {
      this.setState({ titleIsEmpty: true });
    } else {
      this.setState({ titleIsEmpty: false });
    }
  }

  onChangeDescription(e) {
    const content = e.target.getContent();
    this.setState({
      description: content,
    });
  }

  onBeforeAddIngredient(chip) {
    if (this.state.ingredients.some(
      (ingredient) => ingredient.toLowerCase() === chip.toLowerCase(),
    )) {
      this.setState({ ingredientIsDuplicate: true });
      return false;
    }
    this.setState({ ingredientIsDuplicate: false });
    return true;
  }

  onAddIngredient(chip) {
    this.setState((prevState) => ({
      ingredients: [...prevState.ingredients, chip],
    }));
  }

  onDeleteIngredient(chip, index) {
    this.setState((prevState) => ({
      ingredients: prevState.ingredients.filter((_, i) => i !== index),
    }));
  }

  onChangeDirections(e) {
    const content = e.target.getContent();
    this.setState({
      directions: content,
    });
  }

  onBeforeAddTag(chip) {
    if (this.state.tags.some(
      (tag) => tag.toLowerCase() === chip.toLowerCase(),
    )) {
      this.setState({ tagIsDuplicate: true });
      return false;
    }
    this.setState({ tagIsDuplicate: false });
    return true;
  }

  onAddTag(chip) {
    this.setState((prevState) => ({
      tags: [...prevState.tags, chip],
    }));
  }

  onDeleteTag(chip, index) {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((_, i) => i !== index),
    }));
  }

  onChangePreview(picture) {
    if (picture === undefined || picture.length === 0) {
      this.setState({
        preview: {},
        previewChanged: true,
      });
    } else {
      this.setState({
        preview: picture,
        previewChanged: true,
      });
    }
  }

  /**
   * when you have 4 default images and delete one,
   * pictureFiles is empty and pictureDataURLs has 3 links
   *
   * so existing pictures are URLs and new ones are Files
   *
   * How to handle:
   *
   * - use image's keys
   * - if no images are changed, don't send anything to backend
   * - if an image is added, only send that new image to backend
   * - if an image is replaced, send an object of {action: "DELETE", key: key} that says you want to
   *   delete the image with that key and add a new iamge
   * - if an image is deleted, send {action: "DELETE", key: key}
   *
   * Note: pictureFiles doesn't properly change if you add an image and remove it before
   *       submitting. It keeps the file in the array
   */
  // onChangeImages(pictureFiles, pictureDataURLs) {
  //   console.log(this.state.images); // has _id, key, and location
  //   console.log(pictureFiles);
  //   console.log(pictureDataURLs);

  /**
     * if no images are changed, we have an array up to 5 elements of
     *   url strings that match the length of the images state array
     * if picturedataurls is all actual urls and length is less than state images,
     *   find what location from state images doesn't exist in dataurls.
     *     Thats the one we want to delete
     *
     * -------------------------------------------------------------------------
     *
     * if a url from state images locations doesnt exist in pictureDataURLs,
     *   this means that one was deleted so we remove it from the images state and add
     *   to the imagesToDelete state
     *
     * if a data url exists whose name= doesn't match any of the image file names in imagesToAdd,
     *   add the actual file from pictureFiles whos name matches the data's name= to imagesToAdd
     *
     * if an imagesToAdd image name doesn't exist in a data url's name=,
     *   this means an added image was now deleted before submitting.
     *   remove it from imagesToAdd
     *
     * if pictureFiles isn't empty,
     */
  // if (this.state.images.some((image) => !pictureDataURLs.find((url) => url === image.location))) {
  //   const imageToDelete = this.state.images.find(
  //     (image) => !pictureDataURLs.find((url) => url === image.location),
  //   );
  //   console.log(imageToDelete);
  // const test = this.state.images.filter((image) => image.key !== imageToDelete[0].key);
  // console.log(test);
  // console.log(this.state);
  //   this.setState((prevState) => ({
  //     imagesChanged: true,
  //     images: prevState.images.filter((image) => image.key !== imageToDelete.key),

  //     // need this bc function gets called twice for some reason
  //     imagesToDelete: !prevState.imagesToDelete.includes(imageToDelete)
  //       ? [...prevState.imagesToDelete, imageToDelete]
  //       : prevState.imagesToDelete,
  //   }));
  // }

  // if (
  //   pictureDataURLs.some(
  //     (url) => url.startsWith('data:image')
  //       && !this.state.imagesToAdd.find(
  //         (imageFile) => imageFile.name === url.substring(
  //           url.indexOf('name=') + 5,
  //           url.indexOf('base64') - 1,
  //         ),
  //       ),
  //   )) {
  //   const imageToAddDataURL = pictureDataURLs.find(
  //     (url) => url.startsWith('data:image')
  //       && !this.state.imagesToAdd.find(
  //         (imageFile) => imageFile.name === url.substring(
  //           url.indexOf('name=') + 5,
  //           url.indexOf('base64') - 1,
  //         ),
  //       ),
  //   );

  // const imageNameFromDataURL = imageToAddDataURL.substring(
  //   imageToAddDataURL.indexOf('name=') + 5,
  //   imageToAddDataURL.indexOf('base64') - 1,
  // );
  // console.log(imageToAddNameFromDataURL);

  // const imageToAdd = pictureFiles.find((image) => image.name === imageNameFromDataURL);
  // console.log(imageToAdd);

  // this.setState((prevState) => ({
  //   imagesChanged: true,
  //   images: [...prevState.images, imageToAdd],

  //   // need this bc function gets called twice for some reason
  //   imagesToAdd: !prevState.imagesToAdd.includes(imageToAdd)
  //     ? [...prevState.imagesToAdd, imageToAdd]
  //     : prevState.imagesToAdd,
  // }), () => console.log(this.state));
  // }
  // }

  onSubmit() {
    if (!this.handleValidation()) {
      console.log('Form invalid');
      return;
    }

    editSuccessful = true;

    /**
     * if preview hasn't been touched, we want to keep it the same
     * else if preview has been changed and there is a new image, we want to update it
     * else (preview has been changed and the image was deleted), we want to delete it
     */

    let preview;

    //*  if preview wasn't changed by user, we don't want to send any preview key to backend
    if (this.state.previewChanged === false) {
      preview = undefined;
    } else if (Object.keys(this.state.preview).length !== 0) {
      [preview] = this.state.preview;
    } else { //*  if preview was changed by being deleted
      preview = null;
    }

    // let images;
    // if (this.state.imagesChanged === false) {
    //   images = undefined;
    // }

    const recipe = {
      title: sanitizeHtml(this.state.title),
      description: this.state.description,
      ingredients: this.state.ingredients,
      directions: this.state.directions,
      tags: this.state.tags,
      preview,
    };

    this.props.updateRecipe(recipe, this.props.recipe._id)
      .then(() => {
        this.props.fetchRecipe(this.props.recipe._id);
      })
      .then(() => {
        this.props.history.push({
          pathname: '/recipes/view/',
          appState: {
            updatePressed: editSuccessful, //*  used for Snackbar alert on View Recipe page
          },
        });
      });
  }

  render() {
    const { error, loading, recipe } = this.props;

    if (error) {
      return (
        <Typography variant="h2" align="center">
          Error!
          {' '}
          {error.message}
        </Typography>
      );
    }

    if (loading) {
      return <LoadingPage />;
    }

    if (recipe === null) {
      return <Typography variant="h2" align="center">Please select a recipe to edit</Typography>;
    }

    //* we only want to show the default preview image in specific cases, finicky
    //* if the preview wasn't changed by the user, we want to show the existing image from the
    //*   backend
    //* if it was changed, we don't want to show this so that their newly chosen image can be
    //*   previewed
    const defaultPreviewImage = () => {
      if (this.state.preview && !this.state.previewChanged) {
        return [this.state.preview.location];
      }
      return undefined;
    };

    // const defaultImages = () => {
    //   if (this.state.images) {
    //     // const imageURLs = this.state.images.filter((image) =/> image.location !== undefined).map((image) => image.location);

    //     const imageURLs = this.state.images.map((image) => image.location);
    //     // console.log(imageURLs);
    //     console.log(imageURLs);
    //     return imageURLs;
    //   }
    //   return undefined;
    // };

    return (
      <div className="container" style={{ marginTop: 10 }}>
        <h3>Update Recipe</h3>

        <Form>

          {/* Preview */}
          <Form.Group controlid="formGroupRecipePreview">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Preview Image</Typography>
            <ImageUploader
              onChange={this.onChangePreview}
              withPreview
              defaultImages={defaultPreviewImage()}
              withIcon
              buttonText="Choose image"
              withLabel
              label="Please close the image before uploading a new one | Max file size: 10mb | Accepted: jpg, gif, png"
              maxFileSize={10485760} // 10 MiB in Bytes
              fileTypeError=" is not a supported file extension"
              singleImage
            />
          </Form.Group>

          {/* Title */}
          <Form.Group controlid="formGroupRecipeTitle">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Title</Typography>
            <TextField
              required
              error={this.state.titleIsEmpty}
              helperText={this.state.titleIsEmpty ? 'required' : ''}
              variant="outlined"
              placeholder="Title"
              value={this.state.title}
              onChange={this.onChangeTitle}
              style={{ width: '100%' }}
            />
          </Form.Group>

          <br />

          {/* Description */}
          <Form.Group controlid="formGroupRecipeDescription">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Description</Typography>
            <Editor
              initialValue={recipe.description}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image',
                  'charmap print preview anchor help',
                  'searchreplace visualblocks code',
                  'insertdatetime media table paste wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
              }}
              onChange={this.onChangeDescription}
              apiKey="mqyujdmrjuid1rkbt26rbvqf8ga7ne6l23noy9kfvmg3q1x3"
            />
          </Form.Group>

          <br />

          {/* Ingredients */}
          <Form.Group controlid="formGroupRecipeIngredients">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Ingredients</Typography>
            <ChipInput
              allowDuplicates={false}
              // TODO: add "dataSource" array for autocompletion
              fullWidth
              value={this.state.ingredients}
              onBeforeAdd={(chip) => this.onBeforeAddIngredient(chip)}
              onAdd={(chip) => this.onAddIngredient(chip)}
              onDelete={(chip, index) => this.onDeleteIngredient(chip, index)}
              helperText={this.state.ingredientIsDuplicate
                ? <Typography variant="caption" color="secondary">Ingredient is a duplicate!</Typography>
                : null}
            />
          </Form.Group>

          <br />

          {/* Directions */}
          <Form.Group controlid="formGroupRecipeDirections">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Directions</Typography>
            <Editor
              initialValue={recipe.directions}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image',
                  'charmap print preview anchor help',
                  'searchreplace visualblocks code',
                  'insertdatetime media table paste wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
              }}
              onChange={this.onChangeDirections}
              apiKey="mqyujdmrjuid1rkbt26rbvqf8ga7ne6l23noy9kfvmg3q1x3"
            />
          </Form.Group>

          <br />

          {/* Tags */}
          <Form.Group controlid="formGroupRecipeTags">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Tags</Typography>
            <ChipInput
              allowDuplicates={false}
              // TODO: add "dataSource" array for autocompletion
              fullWidth
              value={this.state.tags}
              onBeforeAdd={(chip) => this.onBeforeAddTag(chip)}
              onAdd={(chip) => this.onAddTag(chip)}
              onDelete={(chip, index) => this.onDeleteTag(chip, index)}
              helperText={this.state.tagIsDuplicate
                ? <Typography variant="caption" color="secondary">Tag is a duplicate!</Typography>
                : null}
            />
          </Form.Group>

          <br />

          {/* Images */}
          {/* <Form.Group controlid="formGroupRecipeImages">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Images</Typography>
            <ImageUploader
              onChange={this.onChangeImages}
              withPreview
              defaultImages={defaultImages()}
              withIcon
              buttonText="Choose up to 5 images"
              withLabel
              label="Max file size: 10mb | Accepted: jpg, gif, png"
            />
          </Form.Group>

          <br /> */}

          <br />

          <div style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            marginBottom: '10rem',
          }}
          >
            <Button variant="contained" color="primary" onClick={this.onSubmit} style={{ marginRight: '5rem' }}>Update Recipe</Button>
            <Button variant="contained" color="secondary" onClick={() => this.setState({ deleteDialogOpen: true })}>Delete Recipe</Button>
          </div>
          <Dialog
            open={this.state.deleteDialogOpen}
            onClose={() => this.setState({ deleteDialogOpen: false })}
          >
            <DialogTitle>Delete this recipe</DialogTitle>
            <DialogContent>
              <DialogContentText>Are you sure you want to delete this recipe?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleDeleteDialogNo}>No</Button>
              <Button color="secondary" onClick={this.handleDeleteDialogYes}>Yes</Button>
            </DialogActions>
          </Dialog>
        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  {
    updateRecipe, deleteRecipe, removeRecipeFromStateOnUnselected, fetchRecipe,
  },
)(EditRecipe);

EditRecipe.propTypes = {
  recipe: PropTypes.shape({
    _id: Schema.Types.ObjectId.isRequired,
    preview: PropTypes.shape({
      key: PropTypes.string,
      location: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    ingredients: PropTypes.arrayOf(PropTypes.string),
    directions: PropTypes.string,
  }),
  deleteRecipe: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  updateRecipe: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

EditRecipe.defaultProps = {
  recipe: PropTypes.shape({
    preview: null,
    description: '',
    tags: [],
    ingredients: [],
    directions: '',
  }),
  deleteRecipe: () => {},
  updateRecipe: () => {},
  error: null,
  loading: false,
};

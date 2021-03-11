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
import LoadingBar from 'react-redux-loading-bar';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Schema } from 'mongoose';
import {
  deleteRecipe, updateRecipe, removeRecipeFromStateOnUnselected, fetchRecipe,
} from '../../actions/recipes';

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
    // this.onChangeRecipeImage = this.onChangeRecipeImage.bind(this);
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
        // images: this.props.currentRecipe.images,
      });
    }
  }

  // TODO: fix when refresh and want to go back?
  // TODO: fix when you go back to View but then go forward to Edit.
  componentWillUnmount() {
    if (
      this.props.history.action !== 'POP'
      || this.state.appState === undefined
      || !this.state.appState.editPressed
    ) {
      this.props.removeRecipeFromStateOnUnselected();
    }
  }

  // TODO: add checking for correct number of images here
  handleValidation() {
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
    if (this.state.previewChanged === false) {
      preview = undefined;
    } else if (Object.keys(this.state.preview).length !== 0) {
      [preview] = this.state.preview;
    } else {
      preview = null;
    }

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
            updatePressed: editSuccessful,
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
      return (
        <div>
          <LoadingBar
            style={{ backgroundColor: 'blue', height: '5px' }}
            showFastActions
            direction="ltr"
            updateTime={10}
            progressIncrease={90}
            maxProgress={91}
          />
          <Typography variant="h1" align="center">Loading...</Typography>
          ;
        </div>
      );
    }

    if (recipe === null) {
      return <Typography variant="h2" align="center">Please select a recipe to edit</Typography>;
    }

    const defaultPreviewImage = () => {
      if (this.state.preview && !this.state.previewChanged) {
        return [this.state.preview.location];
      }
      return undefined;
    };

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

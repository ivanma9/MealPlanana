import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import ChipInput from 'material-ui-chip-input';
import { Editor } from '@tinymce/tinymce-react';
import { Form } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';
import { connect } from 'react-redux';
import { deleteRecipe, updateRecipe } from '../../actions/recipes';

const sanitizeHtml = require('sanitize-html');

const mapStateToProps = (state) => ({
  recipe: state.recipe.item,
  loading: state.recipe.loading,
  error: state.recipe.error,
});

let editSuccessful = false;

class EditRecipe extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onAddIngredient = this.onAddIngredient.bind(this);
    this.onDeleteIngredient = this.onDeleteIngredient.bind(this);
    this.onChangeDirections = this.onChangeDirections.bind(this);
    this.onAddTag = this.onAddTag.bind(this);
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
      // recipe_author: '',

      titleIsEmpty: false,
      previewChanged: false,
      deleteDialogOpen: false,
    };
  }

  componentDidMount() {
    this.setState({
      title: this.props.recipe.title,
      description: this.props.recipe.description,
      ingredients: this.props.recipe.ingredients,
      directions: this.props.recipe.directions,
      tags: this.props.recipe.tags,
      preview: this.props.recipe.preview,
      // images: this.props.recipe.images,
      // author: this.props.recipe.author
    });
  }

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
        preview: [],
        previewChanged: true,
      });
    } else {
      this.setState({
        preview: picture,
        previewChanged: true,
      });
    }
  }

  onSubmit(e) {
    if (!this.handleValidation()) {
      console.log('Form invalid');
      return;
    }

    editSuccessful = true;

    let recipe;
    if (this.state.previewChanged === false) {
      recipe = {
        title: sanitizeHtml(this.state.title),
        description: this.state.description,
        ingredients: this.state.ingredients,
        directions: this.state.directions,
        // don't set preview image here. Backend doesn't change
        // preview if no preview is sent, so this is what we want
        tags: this.state.tags,
        // recipe_image: this.state.recipe_image,
        // recipe_author: this.state.recipe_author,
      };
    } else if (this.state.preview.length !== 0) {
      recipe = {
        title: sanitizeHtml(this.state.title),
        description: this.state.description,
        ingredients: this.state.ingredients,
        directions: this.state.directions,
        tags: this.state.tags,
        preview: this.state.preview[0],
        // preview: this.state.preview also seems to work?
        // recipe_image: this.state.recipe_image,
        // recipe_author: this.state.recipe_author,
      };
    } else {
      recipe = {
        title: sanitizeHtml(this.state.title),
        description: this.state.description,
        ingredients: this.state.ingredients,
        directions: this.state.directions,
        tags: this.state.tags,
        preview: {},
        // recipe_image: this.state.recipe_image,
        // recipe_author: this.state.recipe_author,
      };
    }

    // FIXME: recipe isn't updated when we push to /recipes/view
    this.props.updateRecipe(recipe, this.props.recipe._id)
      .then(() => {
        this.props.history.push({
          pathname: '/recipes/view/',
          appState: {
            open: editSuccessful,
          },
        });
      });
  }

  render() {
    const { error, loading, recipe } = this.props;

    if (error) {
      return (
        <Typography variant="h1" align="center">
          Error!
          {' '}
          {error.message}
        </Typography>
      );
    }
    if (loading || recipe === null) {
      return <Typography variant="h1" align="center">Loading...</Typography>;
    }

    return (
      <div className="container" style={{ marginTop: 10 }}>
        <h3>Update Recipe</h3>

        <Form>

          <Form.Group controlid="formGroupRecipePreview">
            <ImageUploader
              onChange={this.onChangePreview}
              withPreview
              defaultImages={recipe.preview && [recipe.preview.location]}
              withIcon
              buttonText="Choose image"
              withLabel
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
              onAdd={(chip) => this.onAddIngredient(chip)}
              onDelete={(chip, index) => this.onDeleteIngredient(chip, index)}
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
              onAdd={(chip) => this.onAddTag(chip)}
              onDelete={(chip, index) => this.onDeleteTag(chip, index)}
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
  { updateRecipe, deleteRecipe },
)(EditRecipe);

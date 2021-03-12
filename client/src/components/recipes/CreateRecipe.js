import {
  Button, TextField, Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import ChipInput from 'material-ui-chip-input';
import { Editor } from '@tinymce/tinymce-react';
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImageUploader from 'react-images-upload';

import { createRecipe } from '../../actions/recipes';
import LoadingPage from '../LoadingPage';

const sanitizeHtml = require('sanitize-html');

const mapStateToProps = (state) => ({
  loading: state.createRecipe.loading,
  success: state.createRecipe.success,
  error: state.createRecipe.error,
  session: state.session,
});

let createSuccessful = false;

class CreateRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      ingredients: [],
      directions: '',
      tags: [],
      preview: {},
      images: [],
      author: {
        id: '',
        username: '',
      },

      titleIsEmpty: false,
      ingredientIsDuplicate: false,
      tagIsDuplicate: false,
    };

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
    this.onChangeImages = this.onChangeImages.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      author: {
        id: this.props.session.userId,
        username: this.props.session.username,
      },
    });
    window.scrollTo(0, 0);
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
    this.setState({
      preview: picture,
    });
  }

  // TODO: check for duplicate images and don't allow
  onChangeImages(pictureFiles) {
    if (pictureFiles.length > 5) {
      // do something
    } else {
      this.setState({
        images: pictureFiles,
      });
    }
  }

  onSubmit() {
    if (!this.handleValidation()) {
      console.log('Form invalid');
      return;
    }

    createSuccessful = true;

    console.log(this.props.session.userId);
    console.log('Form submitted:');
    console.log(`Recipe Title: ${this.state.title}`);
    console.log(`Recipe Description: ${this.state.description}`);
    console.log(`Recipe Ingredients: ${this.state.ingredients}`);
    console.log(`Recipe Directions: ${this.state.directions}`);
    console.log(`Recipe Tags: ${this.state.tags}`);
    console.log(`Recipe Preview: ${this.state.preview}`);
    console.log(`Recipe Images: ${this.state.images}`);
    console.log(`Recipe Author ID: ${this.state.author.id}`);
    console.log(`Recipe Author Username: ${this.state.author.username}`);

    // TODO: more advanced sanitizing. Error if user trying to input bad data and don't post to db?
    const newRecipe = {
      title: sanitizeHtml(this.state.title),
      description: this.state.description,
      ingredients: this.state.ingredients,
      directions: this.state.directions,
      tags: this.state.tags,
      preview: this.state.preview[0],
      images: this.state.images,
      ratingTotal: 0,
      author: {
        id: this.state.author.id,
        username: this.state.author.username,
      },
    };

    console.log(newRecipe);

    this.setState({
      title: '',
      description: '',
      ingredients: [],
      directions: '',
      tags: [],
      images: [],
      author: {
        id: '',
        username: '',
      },
    });

    this.props.createRecipe(newRecipe)
      .then(() => {
        this.props.history.push({
          pathname: '/recipes',
          appState: {
            createPressed: createSuccessful,
          },
        });
      });
  }

  render() {
    const { error, loading, session } = this.props;

    // if (error) {
    //   return (
    //     <Typography variant="h1" align="center">
    //       Error!
    //       {' '}
    //       {error.message}
    //     </Typography>
    //   );
    // }
    if (loading) {
      return <LoadingPage />;
    }

    return (
      <div className="container" style={{ marginTop: 10 }}>
        <h3>Create New Recipe</h3>

        <Form>

          {/* Preview */}
          <Form.Group controlid="formGroupRecipePreview">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Preview Image</Typography>
            <ImageUploader
              onChange={this.onChangePreview}
              withPreview
              withIcon
              buttonText="Choose image"
              withLabel
              label="Max file size: 10mb | Accepted: jpg, gif, png"
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
              initialValue=""
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
              initialValue=""
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
          <Form.Group controlid="formGroupRecipeImages">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Images</Typography>
            <ImageUploader
              onChange={this.onChangeImages}
              withPreview
              withIcon
              buttonText="Choose up to 5 images"
              withLabel
              label="Max file size: 10mb | Accepted: jpg, gif, png"
              maxFileSize={10485760} // 10 MiB in Bytes
              fileTypeError=" is not a supported file extension"
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
            <Button variant="contained" color="primary" onClick={this.onSubmit}>Create Recipe</Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { createRecipe },
)(CreateRecipe);

CreateRecipe.propTypes = {
  session: PropTypes.shape({
    email: PropTypes.string,
    meals: PropTypes.arrayOf(PropTypes.object),
    ratings: PropTypes.arrayOf(PropTypes.object),
    recipes: PropTypes.arrayOf(PropTypes.string),
    userId: PropTypes.string.isRequired,
    username: PropTypes.string,
  }).isRequired,
  createRecipe: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  // error(props, propName, componentName) {
  //   try {
  //     JSON.parse(props[propName]);
  //     return null;
  //   } catch (e) {
  //     return new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`);
  //   }
  // },
  loading: PropTypes.bool,
};

CreateRecipe.defaultProps = {
  createRecipe: () => {},
  // error: null,
  loading: false,
};

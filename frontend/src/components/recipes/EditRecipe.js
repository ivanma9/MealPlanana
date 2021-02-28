import React, { Component } from 'react';

import Box from '@material-ui/core/Box';
import ButtonMUI from '@material-ui/core/Button';
import ChipInput from 'material-ui-chip-input';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Form } from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import ImageUploader from 'react-images-upload';
import { fetchRecipe, updateRecipe } from '../../actions/recipes';

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
    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
    this.onChangeRecipeDescription = this.onChangeRecipeDescription.bind(this);
    this.onAddRecipeIngredient = this.onAddRecipeIngredient.bind(this);
    this.onDeleteRecipeIngredient = this.onDeleteRecipeIngredient.bind(this);
    this.onChangeRecipeDirections = this.onChangeRecipeDirections.bind(this);
    this.onAddRecipeTag = this.onAddRecipeTag.bind(this);
    this.onDeleteRecipeTag = this.onDeleteRecipeTag.bind(this);
    this.onChangeRecipePreview = this.onChangeRecipePreview.bind(this);
    // this.onChangeRecipeImage = this.onChangeRecipeImage.bind(this);
    this.onChangeRecipeRating = this.onChangeRecipeRating.bind(this);
    // this.onChangeRecipeAuthor = this.onChangeRecipeAuthor.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    // this.recipeLoaded = this.recipeLoaded.bind(this);

    this.state = {
      title: '',
      description: '',
      ingredients: [],
      directions: '',
      tags: [],
      preview: {},
      images: [],
      ratingTotal: 0,
      // recipe_author: '',

      titleIsEmpty: false,
      // directionsIsEmpty: false,
      previewChanged: false,
    };
  }

  // FIXME: getting null errors because
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchRecipe(id);
    // window.addEventListener('load', this.recipeLoaded, true);
    // window.addEventListener('load', () => {
    //   if (this.props.recipe) {
    //     this.setState({
    //       ingredients: this.props.recipe.ingredients,
    //       tags: this.props.recipe.tags,
    //     });
    //   }
    // }, true);
    // this.setState({
    //   // title: this.props.recipe.title,
    //   // description: this.props.recipe.description,
    //   ingredients: this.props.recipe.ingredients,
    //   // directions: this.props.recipe.directions,
    //   tags: this.props.recipe.tags,
    //   // preview: this.props.recipe.preview,
    //   // images: this.props.recipe.images,
    //   // ratingTotal: Number(this.props.recipe.ratingTotal),
    //   // author: this.props.recipe.author
    // });
  }

  // componentWillUnmount() {
  //   window.removeEventListener('load', this.recipeLoaded);
  // }

  componentDidUpdate(prevProps) {
    if (this.props.recipe !== prevProps.recipe) {
      this.setState({
        title: this.props.recipe.title,
        description: this.props.recipe.description,
        ingredients: this.props.recipe.ingredients,
        directions: this.props.recipe.directions,
        tags: this.props.recipe.tags,
        preview: this.props.recipe.preview,
        images: this.props.recipe.images,
        ratingTotal: Number(this.props.recipe.ratingTotal),
      // author: this.props.recipe.author
      });
    }
  }

  handleValidation() {
    let formIsValid = true;

    // const { title } = this.props.recipe;
    const { title } = this.state;
    // const { directions } = this.state;

    if (title.length === 0) {
      this.setState({ titleIsEmpty: true });
      formIsValid = false;
    } else this.setState({ titleIsEmpty: false });

    // if (directions.length === 0) {
    //   this.setState({ directionsIsEmpty: true });
    //   formIsValid = false;
    // } else this.setState({ directionsIsEmpty: false });

    return formIsValid;
  }

  onChangeRecipeTitle(e) {
    this.setState({
      title: e.target.value,
    });
    // this.props.recipe.title = e.target.value;

    if (e.target.value.length === 0) {
      this.setState({ titleIsEmpty: true });
    } else {
      this.setState({ titleIsEmpty: false });
    }
  }

  onChangeRecipeDescription(e) {
    const content = e.target.getContent();
    this.setState({
      description: content,
    });
    // this.props.recipe.description = content;
  }

  onAddRecipeIngredient(chip) {
    this.setState((prevState) => ({
      ingredients: [...prevState.ingredients, chip],
    }));
  }

  onDeleteRecipeIngredient(chip, index) {
    this.setState((prevState) => ({
      ingredients: prevState.ingredients.filter((_, i) => i !== index),
    }));
  }

  onChangeRecipeDirections(e) {
    const content = e.target.getContent();
    this.setState({
      directions: content,
    });
    // this.props.recipe.directions = content;

    // if (content.length === 0) {
    //   this.setState({ directionsIsEmpty: true });
    // } else {
    //   this.setState({ directionsIsEmpty: false });
    // }
  }

  onAddRecipeTag(chip) {
    this.setState((prevState) => ({
      tags: [...prevState.tags, chip],
    }));
  }

  onDeleteRecipeTag(chip, index) {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((_, i) => i !== index),
    }));
  }

  onChangeRecipePreview(picture) {
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
    // this.setState({
    //   preview: picture,
    // });
    // this.props.recipe.preview = picture;
  }

  // onChangeRecipeImage(e) {
  //   this.setState({
  //     recipe_image: e.target.value,
  //   });
  // }

  onChangeRecipeRating(e) {
    this.setState({
      ratingTotal: Number(e.target.value),
    });
    // this.props.recipe.ratingTotal = e.target.value;
  }

  // onChangeRecipeAuthor(e) {
  //   this.setState({
  //     recipe_author: e.target.value,
  //   });
  // }

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
        ratingTotal: this.state.ratingTotal,
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
        ratingTotal: this.state.ratingTotal,
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
        ratingTotal: this.state.ratingTotal,
      // recipe_author: this.state.recipe_author,
      };
    }

    // const recipe = {
    //   title: sanitizeHtml(this.state.title),
    //   description: this.state.description,
    //   ingredients: this.state.ingredients,
    //   directions: this.state.directions,
    //   tags: this.state.tags,
    //   preview: (this.state.preview && this.state.preview[0]) || '',
    //   // recipe_image: this.state.recipe_image,
    //   ratingTotal: this.state.ratingTotal,
    //   // recipe_author: this.state.recipe_author,
    // };
    // const recipe = {
    //   title: sanitizeHtml(this.props.recipe.title),
    //   description: this.props.recipe.description,
    //   ingredients: this.props.recipe.ingredients,
    //   directions: this.props.recipe.directions,
    //   tags: this.props.recipe.tags,
    //   preview: this.props.recipe.preview,
    //   // recipe_image: this.props.recipe.recipe_image,
    //   ratingTotal: this.props.recipe.ratingTotal,
    //   // recipe_author: this.props.recipe.recipe_author,
    // };

    // this.props.updateRecipe(recipe, this.props.match.params.id);

    this.props.updateRecipe(recipe, this.props.match.params.id).then(() => {
      this.props.history.push({
        pathname: `/recipes/view/${this.props.match.params.id}`,
        appState: {
          open: editSuccessful,
        },
      });
    });
  }

  // recipeLoaded = () => {
  //   if (this.props.recipe) {
  //     this.setState({
  //       ingredients: this.props.recipe.ingredients,
  //       tags: this.props.recipe.tags,
  //     });
  //   }
  // }

  getPreviewImage = () => {
    // if (e) {
    // }
    if (Object.keys(this.state.preview).length === 1) {
      return [];
    }
    return [this.state.preview.location];

    // return [];
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
              onChange={this.onChangeRecipePreview}
              withPreview
              // defaultImages={this.getPreviewImage()}
              // defaultImages={['http://images.unsplash.com/flagged/photo-1566127992631-137a642a90f4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max']}
              defaultImages={recipe.preview && [recipe.preview.location]}
              withIcon
              buttonText="Choose image"
              // buttonType="submit"
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
              // value={recipe.title}
              onChange={this.onChangeRecipeTitle}
              style={{ width: '100%' }}
            />
          </Form.Group>

          <br />

          {/* Description */}
          <Form.Group controlid="formGroupRecipeDescription">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Description</Typography>
            <Editor
              initialValue={recipe.description}
              // initialValue={this.state.description}
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
              onChange={this.onChangeRecipeDescription}
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
              onAdd={(chip) => this.onAddRecipeIngredient(chip)}
              onDelete={(chip, index) => this.onDeleteRecipeIngredient(chip, index)}
            />
          </Form.Group>

          <br />

          {/* Directions */}
          {/* TODO: Implement check to make sure something is entered in the field */}
          <Form.Group controlid="formGroupRecipeDirections">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Directions</Typography>
            <Editor
              // initialValue={this.state.directions}
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
              onChange={this.onChangeRecipeDirections}
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
              onAdd={(chip) => this.onAddRecipeTag(chip)}
              onDelete={(chip, index) => this.onDeleteRecipeTag(chip, index)}
            />
          </Form.Group>

          {/* TODO: add image preview and upload ability */}

          <br />

          {/* Rating */}
          <Form.Group controlid="formGroupRecipeRating">
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Rating</Typography>
              <Rating
                name="hearts"
                defaultValue={0}
                value={this.state.ratingTotal}
                // value={recipe.ratingTotal}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                style={{ color: 'red' }}
                onChange={this.onChangeRecipeRating}
              />
            </Box>
          </Form.Group>

          <br />

          <div style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
          >
            <ButtonMUI variant="contained" color="primary" onClick={this.onSubmit}>Update Recipe</ButtonMUI>
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
  { fetchRecipe, updateRecipe },
)(EditRecipe);

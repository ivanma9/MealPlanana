import React, { Component } from 'react';

import Box from '@material-ui/core/Box';
import ButtonMUI from '@material-ui/core/Button';
import ChipInput from 'material-ui-chip-input';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Form } from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

export default class CreateRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe_title: '',
      recipe_description: '',
      recipe_ingredients: [],
      recipe_directions: '',
      recipe_tags: [],
      // recipe_image: '',
      recipe_rating: 0,
      // recipe_author: '',

      titleIsEmpty: false,
      directionsIsEmpty: false,
    };

    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
    this.onChangeRecipeDescription = this.onChangeRecipeDescription.bind(this);
    this.onAddRecipeIngredient = this.onAddRecipeIngredient.bind(this);
    this.onDeleteRecipeIngredient = this.onDeleteRecipeIngredient.bind(this);
    this.onChangeRecipeDirections = this.onChangeRecipeDirections.bind(this);
    this.onAddRecipeTag = this.onAddRecipeTag.bind(this);
    this.onDeleteRecipeTag = this.onDeleteRecipeTag.bind(this);
    // this.onChangeRecipeImage = this.onChangeRecipeImage.bind(this);
    this.onChangeRecipeRating = this.onChangeRecipeRating.bind(this);
    // this.onChangeRecipeAuthor = this.onChangeRecipeAuthor.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleValidation() {
    let formIsValid = true;

    const title = this.state.recipe_title;
    const directions = this.state.recipe_directions;

    if (title.length === 0) {
      this.setState({ titleIsEmpty: true });
      formIsValid = false;
    } else this.setState({ titleIsEmpty: false });

    if (directions.length === 0) {
      this.setState({ directionsIsEmpty: true });
      formIsValid = false;
    } else this.setState({ directionsIsEmpty: false });

    return formIsValid;
  }

  onChangeRecipeTitle(e) {
    this.setState({
      recipe_title: e.target.value,
    });

    if (e.target.value.length === 0) {
      this.setState({ titleIsEmpty: true });
    } else {
      this.setState({ titleIsEmpty: false });
    }
  }

  onChangeRecipeDescription(e) {
    this.setState({
      recipe_description: e.target.getContent(),
    });
  }

  onAddRecipeIngredient(chip) {
    this.setState((prevState) => ({
      recipe_ingredients: [...prevState.recipe_ingredients, chip],
    }));
  }

  onDeleteRecipeIngredient(chip, index) {
    this.setState((prevState) => ({
      recipe_ingredients: prevState.recipe_ingredients.filter((_, i) => i !== index),
    }));
  }

  onChangeRecipeDirections(e) {
    const content = e.target.getContent();
    this.setState({
      recipe_directions: content,
    });

    if (content === 0) {
      this.setState({ directionsIsEmpty: true });
    } else {
      this.setState({ directionsIsEmpty: false });
    }
  }

  onAddRecipeTag(chip) {
    this.setState((prevState) => ({
      recipe_tags: [...prevState.recipe_tags, chip],
    }));
  }

  onDeleteRecipeTag(chip, index) {
    this.setState((prevState) => ({
      recipe_tags: prevState.recipe_tags.filter((_, i) => i !== index),
    }));
  }

  // onChangeRecipeImage(e) {
  //   this.setState({
  //     recipe_image: e.target.value,
  //   });
  // }

  onChangeRecipeRating(e) {
    this.setState({
      recipe_rating: e.target.value,
    });
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

    console.log('Form submitted:');
    console.log(`Recipe Title: ${this.state.recipe_title}`);
    console.log(`Recipe Description: ${this.state.recipe_description}`);
    console.log(`Recipe Ingredients: ${this.state.recipe_ingredients}`);
    console.log(`Recipe Directions: ${this.state.recipe_directions}`);
    console.log(`Recipe Tags: ${this.state.recipe_tags}`);
    // console.log(`Recipe Image: ${this.state.recipe_image}`);
    console.log(`Recipe Rating: ${this.state.recipe_rating}`);
    // console.log(`Recipe Author: ${this.state.recipe_author}`);

    const newRecipe = {
      recipe_title: this.state.recipe_title,
      recipe_description: this.state.recipe_description,
      recipe_ingredients: this.state.recipe_ingredients,
      recipe_directions: this.state.recipe_directions,
      recipe_tags: this.state.recipe_tags,
      // recipe_image: this.state.recipe_image,
      recipe_rating: this.state.recipe_rating,
      // recipe_author: this.state.recipe_author,
    };

    console.log(newRecipe);

    axios
      .post('http://localhost:4000/recipes/add', newRecipe)
      .then((res) => console.log(res.data));

    this.setState({
      recipe_title: '',
      recipe_description: '',
      recipe_ingredients: [],
      recipe_directions: '',
      recipe_tags: [],
      // recipe_image: '',
      recipe_rating: 0,
      // recipe_author: '',
    });

    this.props.history.push('/');
  }

  render() {
    return (
      <div style={{ marginTop: 10 }}>
        <h3>Create New Recipe</h3>

        <Form>

          {/* Title */}
          {/* TODO: Implement check to make sure something is entered in the field */}
          <Form.Group controlid="formGroupRecipeTitle">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Title</Typography>
            <TextField
              required
              error={this.state.titleIsEmpty}
              helperText={this.state.titleIsEmpty ? 'required' : ''}
              variant="outlined"
              placeholder="Title"
              value={this.state.recipe_title}
              onChange={this.onChangeRecipeTitle}
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
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image',
                  'charmap print preview anchor help',
                  'searchreplace visualblocks code',
                  'insertdatetime media table paste wordcount',
                ],
                toolbar:
            'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help',
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
              value={this.state.recipe_ingredients}
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
              initialValue=""
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image',
                  'charmap print preview anchor help',
                  'searchreplace visualblocks code',
                  'insertdatetime media table paste wordcount',
                ],
                toolbar:
            'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help',
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
              value={this.state.recipe_tags}
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
                value={this.state.recipe_rating}
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
            <ButtonMUI variant="contained" color="primary" onClick={this.onSubmit}>Create Recipe</ButtonMUI>
          </div>
        </Form>
      </div>
    );
  }
}

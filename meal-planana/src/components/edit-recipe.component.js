import React, { Component } from 'react';

import Box from '@material-ui/core/Box';
import ButtonMUI from '@material-ui/core/Button';
import ChipInput from 'material-ui-chip-input';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Form } from 'react-bootstrap';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

// TODO: Must check if the recipe is owned by the user trying to edit it?
// TODO: have recipe ingredients and tags autofill based on items already present in the directory?

export default class EditRecipe extends Component {
  constructor(props) {
    super(props);
    this.onChangeRecipeTitle = this.onChangeRecipeTitle.bind(this);
    this.onChangeRecipeDescription = this.onChangeRecipeDescription.bind(this);
    this.onAddRecipeIngredient = this.onAddRecipeIngredient.bind(this);
    this.onDeleteRecipeIngredient = this.onDeleteRecipeIngredient.bind(this);
    this.onChangeRecipeDirections = this.onChangeRecipeDirections.bind(this);
    this.onAddRecipeTag = this.onAddRecipeTag.bind(this);
    this.onDeleteRecipeTag = this.onDeleteRecipeTag.bind(this);
    this.onChangeRecipeImage = this.onChangeRecipeImage.bind(this);
    this.onChangeRecipeRating = this.onChangeRecipeRating.bind(this);
    this.onChangeRecipeAuthor = this.onChangeRecipeAuthor.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      recipe_title: '',
      recipe_description: '',
      recipe_ingredients: [],
      recipe_directions: '',
      recipe_tags: [],
      recipe_image: '',
      recipe_rating: 0,
      recipe_author: '',

      titleIsEmpty: false,
      directionsIsEmpty: false,
    };
  }

  componentDidMount() {
    axios
      .get(`http://localhost:4000/recipes/${this.props.match.params.id}`)
      .then((response) => {
        this.setState({
          recipe_title: response.data.recipe_title,
          recipe_description: response.data.recipe_description,
          recipe_ingredients: response.data.recipe_ingredients,
          recipe_directions: response.data.recipe_directions,
          recipe_tags: response.data.recipe_tags,
          recipe_image: response.data.recipe_image,
          recipe_rating: response.data.recipe_rating,
          recipe_author: response.data.recipe_author,
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
      recipe_description: e.target.value,
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
    this.setState({
      recipe_directions: e.target.value,
    });

    if (e.target.value.length === 0) {
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

  onChangeRecipeImage(e) {
    this.setState({
      recipe_image: e.target.value,
    });
  }

  onChangeRecipeRating(e) {
    // TODO: instead of changing the direct value of the recipe, we want to add the user's rating
    // TODO:   to the average rating of the item

    // TODO: idea: have 2 rating fields, 1 that shows the average and updates it once user
    // TODO:   submits their rating, and another field just for the user's input so they
    // TODO:   know what rating they had given and can change it at any time. But would
    // TODO:   have to handle this. Might be difficult.
    this.setState({
      recipe_rating: e.target.value,
    });
  }

  onChangeRecipeAuthor(e) {
    this.setState({
      recipe_author: e.target.value,
    });
  }

  onSubmit(e) {
    if (!this.handleValidation()) {
      console.log('Form invalid');
      return;
    }

    const obj = {
      recipe_title: this.state.recipe_title,
      recipe_description: this.state.recipe_description,
      recipe_ingredients: this.state.recipe_ingredients,
      recipe_directions: this.state.recipe_directions,
      recipe_tags: this.state.recipe_tags,
      recipe_image: this.state.recipe_image,
      recipe_rating: this.state.recipe_rating,
      recipe_author: this.state.recipe_author,
    };

    console.log(obj);

    axios
      .post(
        `http://localhost:4000/recipes/update/${
          this.props.match.params.id}`,
        obj,
      )
      .then((res) => console.log(res.data));

    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <h3 align="center">Update Recipe</h3>
        <Form>

          {/* Title */}
          {/* TODO: Implement check to make sure something is entered in the field */}
          <Form.Group controlID="formGroupRecipeTitle">
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
          <Form.Group controlID="formGroupRecipeDescription">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Description</Typography>
            <TextField
              multiline
              variant="outlined"
              placeholder="Description"
              value={this.state.recipe_description}
              onChange={this.onChangeRecipeDescription}
              style={{ width: '100%' }}
              rows={3}
              rowsMax={15}
            />
          </Form.Group>

          <br />

          {/* Ingredients */}
          <Form.Group controlID="formGroupRecipeIngredients">
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
          <Form.Group controlID="formGroupRecipeDirections">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Directions</Typography>
            <TextField
              multiline
              required
              error={this.state.directionsIsEmpty}
              helperText={this.state.directionsIsEmpty ? 'required' : ''}
              variant="outlined"
              placeholder="Directions"
              value={this.state.recipe_directions}
              onChange={this.onChangeRecipeDirections}
              style={{ width: '100%' }}
              rows={3}
              rowsMax={15}
            />
          </Form.Group>

          <br />

          {/* Tags */}
          <Form.Group controlID="formGroupRecipeTags">
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
          <Form.Group controlID="formGroupRecipeRating">
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
            <Paper
              elevation={3}
              style={{
                paddingLeft: '4rem',
                paddingRight: '4rem',
                paddingTop: '1rem',
                paddingBottom: '0.3rem',
                display: 'block',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Form.Group
                controlID="formGroupRecipeAuthor"
                className="text-center"
              >
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Author</Typography>
                <Typography>{this.state.recipe_author}</Typography>
              </Form.Group>
            </Paper>
          </div>

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

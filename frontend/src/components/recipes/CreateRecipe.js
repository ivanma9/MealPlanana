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
import MuiAlert from '@material-ui/lab/Alert';
import { createRecipe } from '../../actions/recipes';

const mapStateToProps = (state) => ({
  loading: state.createRecipe.loading,
  success: state.createRecipe.success,
  error: state.createRecipe.error,
});

// const mapDispatchToProps = (dispatch) => ({
//   createRecipe: () => dispatch(createRecipe()),
// });

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// function createSuccessful() {
//   return (
//     <Alert severity="success">Recipe successfully created!</Alert>
//   );
// }

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
      // recipe_image: '',
      ratingTotal: 0,
      // recipe_author: '',

      titleIsEmpty: false,
      // directionsIsEmpty: false,
      // createSuccessful: false,
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

  // componentDidMount() {
  //   this.props.createRecipe();
  // }

  handleValidation() {
    let formIsValid = true;

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

    if (e.target.value.length === 0) {
      this.setState({ titleIsEmpty: true });
    } else {
      this.setState({ titleIsEmpty: false });
    }
  }

  onChangeRecipeDescription(e) {
    this.setState({
      description: e.target.value,
    });
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
    this.setState({
      directions: e.target.value,
    });

    if (e.target.value.length === 0) {
      this.setState({ directionsIsEmpty: true });
    } else {
      this.setState({ directionsIsEmpty: false });
    }
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

  // onChangeRecipeImage(e) {
  //   this.setState({
  //     recipe_image: e.target.value,
  //   });
  // }

  onChangeRecipeRating(e) {
    this.setState({
      ratingTotal: e.target.value,
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

    createSuccessful = true;
    console.log(createSuccessful);

    console.log('Form submitted:');
    console.log(`Recipe Title: ${this.state.title}`);
    console.log(`Recipe Description: ${this.state.description}`);
    console.log(`Recipe Ingredients: ${this.state.ingredients}`);
    console.log(`Recipe Directions: ${this.state.directions}`);
    console.log(`Recipe Tags: ${this.state.tags}`);
    // console.log(`Recipe Image: ${this.state.recipe_image}`);
    console.log(`Recipe Rating: ${this.state.ratingTotal}`);
    // console.log(`Recipe Author: ${this.state.recipe_author}`);

    const newRecipe = {
      title: this.state.title,
      description: this.state.description,
      ingredients: this.state.ingredients,
      directions: this.state.directions,
      tags: this.state.tags,
      // recipe_image: this.state.recipe_image,
      ratingTotal: this.state.ratingTotal,
      // recipe_author: this.state.recipe_author,
    };

    console.log(newRecipe);

    this.props.createRecipe(newRecipe);

    this.setState({
      title: '',
      description: '',
      ingredients: [],
      directions: '',
      tags: [],
      // recipe_image: '',
      ratingTotal: 0,
      // recipe_author: '',

      // createSuccessful: true,
    });

    // createSuccessful();
    // console.log(this.state.createSuccessful);

    // this.props.history.push('/recipes');
    this.props.history.push({
      pathname: '/recipes',
      appState: {
        open: createSuccessful,
        // createSuccessful,
      },
    });
  }

  render() {
    const { error, loading } = this.props;
    // console.log(success);

    if (error) {
      return (
        <Typography variant="h1" align="center">
          Error!
          {' '}
          {error.message}
        </Typography>
      );
    }
    if (loading) {
      return <Typography variant="h1" align="center">Loading...</Typography>;
    }
    // if (this.state.createSuccessful) {
    //   console.log('hi');
    //   return <Alert severity="success">Recipe successfully created!</Alert>;
    // }

    return (
      <div style={{ marginTop: 10 }}>
        <h3>Create New Recipe</h3>

        {/* {createSuccessful && <Alert severity="success">Recipe successfully created!</Alert>} */}
        {/* {console.log(createSuccessful)} */}

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
              value={this.state.title}
              onChange={this.onChangeRecipeTitle}
              style={{ width: '100%' }}
            />
          </Form.Group>

          <br />

          {/* Description */}
          <Form.Group controlid="formGroupRecipeDescription">
            <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Description</Typography>
            <TextField
              multiline
              variant="outlined"
              placeholder="Description"
              value={this.state.description}
              onChange={this.onChangeRecipeDescription}
              style={{ width: '100%' }}
              rows={3}
              rowsMax={15}
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
            <TextField
              multiline
              required
              error={this.state.directionsIsEmpty}
              helperText={this.state.directionsIsEmpty ? 'required' : ''}
              variant="outlined"
              placeholder="Directions"
              value={this.state.directions}
              onChange={this.onChangeRecipeDirections}
              style={{ width: '100%' }}
              rows={3}
              rowsMax={15}
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

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
  { createRecipe },
)(CreateRecipe);

import {
  CardMedia,
  Chip,
  Fab,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { Component } from 'react';

import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { Link } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import { connect } from 'react-redux';
import { fetchRecipe } from '../../actions/recipes';

const mapStateToProps = (state) => ({
  recipe: state.recipe.item,
  loading: state.recipe.loading,
  error: state.recipe.error,
});

// const mapDispatchToProps = (dispatch) => ({
//   fetchRecipe: (id) => dispatch(fetchRecipe(id)),
// });

class ViewRecipe extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchRecipe(id);
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
    if (loading) {
      return <Typography variant="h1" align="center">Loading...</Typography>;
    }
    if (recipe === null) {
      return <Typography variant="h1" align="center">Undef...</Typography>;
    }

    return (
      <div>
        <Link
          to={`/edit/${recipe._id}`}
          style={{ color: 'black', textDecoration: 'none' }}
        >
          <Fab color="primary" variant="extended" style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
            <EditIcon />
            Edit
          </Fab>
        </Link>

        <CardMedia
          component="img"
          image={recipe.preview && recipe.preview.location}
          style={{
            height: '20rem', marginBottom: '1rem', width: '100%',
          }}
        />

        <div style={{ marginLeft: '5rem', marginRight: '5rem' }}>
          {/* Title */}
          <Typography variant="h2" align="center" gutterBottom style={{ fontWeight: '400' }}>{recipe.title}</Typography>

          <Grid container spacing={1}>
            {/* Description */}
            <Grid container>
              <Grid item sm={12} md={2}>
                <Typography
                  variant="button"
                  component="legend"
                  className="mb-2"
                  style={{
                    fontSize: 18, width: 'auto', height: 'auto', paddingRight: '2rem',
                  }}
                >
                  Description:
                </Typography>
              </Grid>
              <Grid item sm={12} md={10}>
                <Typography variant="body1" style={{ paddingTop: '0.23em', whiteSpace: 'pre-line' }}>
                  {recipe.description}
                </Typography>
              </Grid>
            </Grid>

            {/* Ingredients */}
            <Grid container style={{ marginTop: '5rem' }}>
              <Grid item sm={12} md={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Ingredients:</Typography>
              </Grid>
              <Grid item sm={12} md={10}>
                {recipe.ingredients.map((ingredient, i) => (
                  <Chip
                    label={ingredient}
                    key={i}
                    style={{
                      marginRight: '1rem', paddingLeft: '0.2rem', paddingRight: '0.2rem', backgroundColor: 'lightsalmon', fontSize: 16, fontWeight: '500',
                    }}
                  />
                ))}
              </Grid>
            </Grid>

            {/* Directions */}
            <Grid container style={{ marginTop: '5rem' }}>
              <Grid item sm={12} md={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}> Directions: </Typography>
              </Grid>
              <Grid item sm={12} md={10}>
                <Typography variant="body1" style={{ paddingTop: '0.23em', whiteSpace: 'pre-line' }}>
                  {recipe.directions}
                </Typography>
              </Grid>
            </Grid>

            {/* Tags */}
            <Grid container style={{ marginTop: '5rem' }}>
              <Grid item sm={12} md={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}> Tags: </Typography>
              </Grid>
              <Grid item sm={12} md={10}>
                {recipe.tags.map((tag, i) => (
                  <Chip
                    label={tag}
                    key={i}
                    style={{
                      marginRight: '1rem', paddingLeft: '0.2rem', paddingRight: '0.2rem', backgroundColor: 'lawngreen', fontSize: 16, fontWeight: '500',
                    }}
                  />
                ))}
              </Grid>
            </Grid>

            {/* Rating */}
            <Grid container style={{ marginTop: '5rem' }}>
              <Grid item sm={12} md={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}> Rating: </Typography>
              </Grid>
              <Grid item>
                <Rating
                  name="hearts"
                  defaultValue={0}
                  value={recipe.ratingTotal}
                  precision={0.2}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  readOnly
                  style={{ color: 'red', marginTop: '5%' }}
                />
              </Grid>
            </Grid>

            {/* Author */}
            <Grid container style={{ marginTop: '5rem', justifyContent: 'center' }}>
              <Paper
                elevation={3}
                style={{
                  paddingLeft: '4rem',
                  paddingRight: '4rem',
                  paddingTop: '1.5rem',
                  paddingBottom: '2rem',
                  display: 'block',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="button" component="legend" className="mb-2" align="center" style={{ fontSize: 22 }}>Author</Typography>
                <Typography variant="h1" align="center" style={{ fontSize: 20, fontWeight: '450' }}>Author Goes Here</Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
  { fetchRecipe },
)(ViewRecipe);

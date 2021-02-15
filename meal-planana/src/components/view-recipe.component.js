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
import axios from 'axios';

export default class ViewRecipe extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recipe_title: '',
      recipe_description: '',
      recipe_ingredients: [],
      recipe_directions: '',
      recipe_tags: [],
      recipe_image: '',
      recipe_rating: 0,
      recipe_author: '',

      recipe_id: '',
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

          recipe_id: response.data._id,
        });
        console.log(this.state);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Link
          to={`/edit/${this.state.recipe_id}`}
          style={{ color: 'black', textDecoration: 'none' }}
        >
          <Fab color="primary" variant="extended" style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
            <EditIcon />
            Edit
          </Fab>
        </Link>

        <CardMedia
          component="img"
          image={this.state.recipe_image}
          style={{
            height: '20rem', marginBottom: '1rem', width: '100%',
          }}
        />

        <div style={{ marginLeft: '5rem', marginRight: '5rem' }}>
          {/* Title */}
          <Typography variant="h2" align="center" gutterBottom style={{ fontWeight: '400' }}>{this.state.recipe_title}</Typography>

          <Grid container spacing={1}>
            {/* Description */}
            <Grid container>
              <Grid item xs={2}>
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
              <Grid item xs={10}>
                <Typography variant="body1" style={{ paddingTop: '0.23em', whiteSpace: 'pre-line' }}>
                  {this.state.recipe_description}
                </Typography>
              </Grid>
            </Grid>

            {/* Ingredients */}
            <Grid container style={{ marginTop: '5rem' }}>
              <Grid item xs={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}>Ingredients:</Typography>
              </Grid>
              <Grid item xs={10}>
                {this.state.recipe_ingredients.map((ingredient, i) => (
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
              <Grid item xs={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}> Directions: </Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography variant="body1" style={{ paddingTop: '0.23em', whiteSpace: 'pre-line' }}>
                  {this.state.recipe_directions}
                </Typography>
              </Grid>
            </Grid>

            {/* Tags */}
            <Grid container style={{ marginTop: '5rem' }}>
              <Grid item xs={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}> Tags: </Typography>
              </Grid>
              <Grid item xs={10}>
                {this.state.recipe_tags.map((tag, i) => (
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
              <Grid item xs={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}> Rating: </Typography>
              </Grid>
              <Grid item>
                <Rating
                  name="hearts"
                  defaultValue={0}
                  value={this.state.recipe_rating}
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

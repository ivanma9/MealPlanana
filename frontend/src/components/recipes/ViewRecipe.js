import {
  CardMedia,
  Card,
  Chip,
  Fab,
  Grid,
  Paper,
  Typography,
  Snackbar,
} from '@material-ui/core';
import React, { Component } from 'react';

import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MuiAlert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import { fetchRecipe } from '../../actions/recipes';

const mapStateToProps = (state) => ({
  recipe: state.recipe.item,
  loading: state.recipe.loading,
  error: state.recipe.error,
});

class ViewRecipe extends Component {
  constructor(props) {
    super(props);
    if (this.props.location.appState !== undefined) {
      this.state = {
        open: this.props.location.appState.open,
        activeID: '',
      };
    } else {
      this.state = {
        open: false,
      };
    }
  }

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

    const options = {
      settings: {},
      buttons: {
        showAutoplayButton: false,
        showThumbnailsButton: false,
      },
    };

    const onMouseOver = (currentID) => this.setState({ activeID: currentID });

    const onMouseOut = () => this.setState({ activeID: '' });

    const checkIfCurrentCard = (currentID) => this.state.activeID === currentID;

    return (
      <div>
        <Link
          to={`/recipes/edit/${recipe._id}`}
          style={{ color: 'black', textDecoration: 'none' }}
        >
          <Fab color="primary" variant="extended" style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}>
            <EditIcon />
            Edit
          </Fab>
        </Link>

        <Snackbar
          autoHideDuration={6000}
          open={this.state.open}
          onClose={() => { this.setState({ open: false }); }}
        >
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => { this.setState({ open: false }); }}>Recipe successfully edited!</MuiAlert>
        </Snackbar>

        {console.log(recipe.preview)}
        {recipe.preview
          && (
          <CardMedia
            component="img"
            image={recipe.preview && recipe.preview.location}
            style={{
              height: '20rem', marginBottom: '1rem', width: '100%',
            }}
          />
          )}

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
                <Typography variant="body1" component="span" style={{ paddingTop: '0.23em', whiteSpace: 'pre-line' }}>
                  {ReactHtmlParser(recipe.description)}
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
                <Typography variant="body1" component="span" style={{ paddingTop: '0.23em', whiteSpace: 'pre-line' }}>
                  {ReactHtmlParser(recipe.directions)}
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
            <Grid container style={{ marginTop: '5rem', marginBottom: '5rem' }}>
              <Grid item sm={12} md={2}>
                <Typography variant="button" component="legend" className="mb-2" style={{ fontSize: 18 }}> Rating: </Typography>
              </Grid>
              <Grid item>
                <Rating
                  name="hearts"
                  defaultValue={0}
                  value={Number(recipe.ratingTotal)}
                  precision={0.2}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  readOnly
                  style={{ color: 'red', marginTop: '5%' }}
                />
              </Grid>
            </Grid>

            <SimpleReactLightbox>
              <SRLWrapper options={options}>
                <Grid
                  container
                  alignItems="flex-start"
                  justify="space-evenly"
                >
                  {recipe.images.map(
                    (image) => (
                      <a
                        href={image.location}
                        key={image.key}
                        style={{ padding: '2em' }}
                      >
                        <Card
                          raised={checkIfCurrentCard(image.key)}
                          onMouseOver={() => onMouseOver(image.key)}
                          onMouseLeave={() => onMouseOut()}
                        >
                          <img
                            src={image.location}
                            key={image.key}
                            alt=""
                            height="250rem"
                            zIndex={10}
                            style={{
                              zIndex: 10,
                            }}
                          />
                        </Card>
                      </a>
                    ),
                  )}
                </Grid>
              </SRLWrapper>
            </SimpleReactLightbox>

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

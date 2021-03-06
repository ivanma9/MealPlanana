import {
  Card, CardMedia, Chip, Fab, Grid, Paper, Popover, Snackbar, Typography,
} from '@material-ui/core';
import React, { Component } from 'react';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';

import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MuiAlert from '@material-ui/lab/Alert';
import Rating from '@material-ui/lab/Rating';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { removeRecipeFromStateOnUnselected } from '../../actions/recipes';

const mapStateToProps = (state) => ({
  recipe: state.currentRecipe.item,
  loading: state.currentRecipe.loading,
  error: state.currentRecipe.error,
  userID: state.session.userId,
});

class ViewRecipe extends Component {
  constructor(props) {
    super(props);
    if (this.props.location.appState !== undefined) {
      this.state = {
        updateRecipePressed: this.props.location.appState.updateRecipePressed,
        activeID: '',

        cannotEditPopoverOpen: false,
        cannotEditPopoverAnchorElement: null,

        addRatingPopoverOpen: false,
        addRatingPopoverAnchorElement: null,

        userRating: null,
      };
    } else {
      this.state = {
        updateRecipePressed: false,
      };
    }
  }

  componentWillUnmount() {
    console.log(this.props.history);
    if (
      this.props.history.location.appState === undefined
      || !this.props.history.location.appState.editPressed
    ) {
      this.props.removeRecipeFromStateOnUnselected();
    }
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
      return <Typography variant="h2" align="center">Loading...</Typography>;
    }
    if (recipe === null) {
      return <Typography variant="h2" align="center">Please select a recipe to view</Typography>;
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

    const handleEditButtonClicked = (e) => {
      if (this.props.userID !== this.props.recipe.author.id) {
        this.setState({
          cannotEditPopoverOpen: true,
          cannotEditPopoverAnchorElement: e.currentTarget,
        });
      } else {
        this.props.history.push({
          pathname: '/recipes/edit',
          appState: {
            editPressed: true,
          },
        });
      }
    };

    const handleEditPopoverClosed = () => {
      this.setState({
        cannotEditPopoverOpen: false,
        cannotEditPopoverAnchorElement: null,
      });
    };

    const handleAddRatingButtonClicked = (e) => {
      this.setState({ addRatingPopoverOpen: true, addRatingPopoverAnchorElement: e.currentTarget });
    };

    const handleAddRatingPopoverClosed = () => {
      this.setState({
        addRatingPopoverOpen: false,
        addRatingPopoverAnchorElement: null,
      });
    };

    const onChangeRating = (e) => {
      this.setState({
        userRating: Number(e.target.value),
      });
    };

    return (
      <div>
        <Popover
          open={this.state.cannotEditPopoverOpen || false}
          anchorEl={this.state.cannotEditPopoverAnchorElement}
          onClose={handleEditPopoverClosed}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          <Typography variant="button" style={{ paddingTop: '40rem', padding: '1rem' }}>You are not the author of this recipe</Typography>
        </Popover>

        <Fab
          onClick={handleEditButtonClicked}
          color="primary"
          variant="extended"
          style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
        >
          <EditIcon />
          Edit
        </Fab>

        <Snackbar
          autoHideDuration={6000}
          open={this.state.updateRecipePressed}
          onClose={() => { this.setState({ updateRecipePressed: false }); }}
        >
          <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => { this.setState({ updateRecipePressed: false }); }}>Recipe successfully edited!</MuiAlert>
        </Snackbar>
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
              <Grid item md={2}>
                <Rating
                  name="hearts"
                  defaultValue={0}
                  value={Number(recipe.userRating)}
                  precision={0.2}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  readOnly
                  style={{ color: 'red', marginTop: '2%' }}
                />
              </Grid>
              <Grid item md={2}>
                <Chip label="Add rating" icon={<FavoriteIcon />} clickable color="secondary" onClick={handleAddRatingButtonClicked} style={{ marginTop: '1%' }} />
              </Grid>
            </Grid>

            <Popover
              open={this.state.addRatingPopoverOpen || false}
              anchorEl={this.state.addRatingPopoverAnchorElement}
              onClose={handleAddRatingPopoverClosed}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              {/* FIXME: mouse hover on rating isn't aligned properly */}
              <Rating
                name="hearts"
                defaultValue={0}
                value={Number(this.state.userRating)}
                precision={0.2}
                icon={<FavoriteIcon fontSize="inherit" />}
                onChange={onChangeRating}
                style={{
                  color: 'red',
                  marginTop: '2%',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.3rem',
                }}
              />
            </Popover>

            <SimpleReactLightbox>
              <SRLWrapper options={options}>
                <Grid
                  container
                  alignItems="flex-start"
                  justify="space-evenly"
                >
                  {recipe.images && recipe.images.map(
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
                          />
                        </Card>
                      </a>
                    ),
                  )}
                </Grid>
              </SRLWrapper>
            </SimpleReactLightbox>

            {/* Author */}
            <Grid container style={{ margin: '5rem', justifyContent: 'center' }}>
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
  { removeRecipeFromStateOnUnselected },
)(ViewRecipe);

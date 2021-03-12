import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
  Popover,
  Icon,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import { FaCheck, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rating from '@material-ui/lab/Rating';
import ReactHtmlParser from 'react-html-parser';
import { Schema } from 'mongoose';
import { ReactComponent as Banana } from '../../assets/banana.svg';

export default function Recipe(props) {
  const [isSelected, setSelected] = useState(false);
  // const [maxRecipesReachedForMealPopoverAnchorEl,
  //   setMaxRecipesReachedForMealPopoverAnchorEl] = useState(null);

  // const handleMaxRecipesReachedForMealPopoverOpen = (e) => {
  //   if (props.createMealSelectedRecipesLength >= props.MAX_RECIPES_FOR_MEAL_CREATION) {
  //     setMaxRecipesReachedForMealPopoverAnchorEl(e.currentTarget);
  //   }
  // };

  // const handleMaxRecipesReachedForMealPopoverClose = () => {
  //   setMaxRecipesReachedForMealPopoverAnchorEl(null);
  // };

  // const maxRecipesReachedForMealPopoverOpen = Boolean(maxRecipesReachedForMealPopoverAnchorEl);

  useEffect(() => {
    if (!props.createMealPromptIsOpen) {
      setSelected(false);
    }
  }, [props.createMealPromptIsOpen]);

  // useEffect(() => {
  //   if (props.recipe._id === undefined) {
  //     props.fetchRecipes();
  //   }
  // }, [props.recipe._id]);

  const createMealHandleRecipeSelected = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(true);
    props.createMealHandleRecipeSelected(props.recipe);
  };

  const createMealHandleRecipeUnselected = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(false);
    props.createMealHandleRecipeUnselected(props.recipe);
  };

  return (
    <Link
      to="/recipes/view"
      style={{ color: 'black', textDecoration: 'none', margin: '2rem' }}
    >
      <Card
        raised={
          (!props.createMealPromptIsOpen && props.checkIfCurrentCard(props.recipe._id))
          || isSelected
        }
        onMouseOver={() => props.onMouseOver(props.recipe._id)}
        onMouseLeave={() => props.onMouseOut()}
        onClick={() => props.addRecipeToState(props.recipe._id)}
        style={{
          width: '18rem', borderRadius: '10px', padding: '1rem',
        }}
      >
        <CardMedia
          component="img"
          image={props.recipe.preview && props.recipe.preview.location}
        />
        <CardContent>
          <Typography variant="h5" align="center">{props.recipe.title}</Typography>
          <Typography
            variant="body1"
            component="span"
            style={{
              overflow: 'hidden', textOverflow: 'ellipsis', wordBreak: 'break-word', hyphens: 'auto',
            }}
          >
            {ReactHtmlParser(props.recipe.description)}
          </Typography>
        </CardContent>
        <div align="center">
          {props.recipe.tags.map((tag, i) => (
            <Chip
              size="small"
              label={tag}
              style={{
                backgroundColor: '#ffe135', color: 'black', marginLeft: '1%', marginRight: '1%', marginBottom: '2%',
              }}
              // TODO: change i to be a unique identifier
              // can use:
              //   `const myItemsWithIds = myItems.map((item, index) => { ...item, myId: index });`
              key={i}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Rating
            name="hearts"
            value={props.recipe.ratingTotal}
            precision={0.2}
            icon={<Icon style={{ width: '1.2em', height: 'auto', padding: '4%' }}><Banana /></Icon>}
            emptyIcon={(
              <Icon style={{
                width: '1.2em', height: 'auto', padding: '4%', opacity: 0.3,
              }}
              >
                <Banana />
              </Icon>
)}
            readOnly
            style={{ color: 'yellow', padding: '5%' }}
          />
          {props.createMealPromptIsOpen && !isSelected
            && (
              <IconButton
                onClick={(e) => createMealHandleRecipeSelected(e)}
              // onMouseEnter={handleMaxRecipesReachedForMealPopoverOpen}
              // onMouseLeave={handleMaxRecipesReachedForMealPopoverClose}
                disabled={
                props.createMealSelectedRecipesLength >= props.MAX_RECIPES_FOR_MEAL_CREATION
              }
                style={{
                  marginTop: '5%', padding: '5%', pointerEvents: 'auto',
                }}
              >
                <FaPlus />
              </IconButton>
            )}
          {props.createMealPromptIsOpen && isSelected
            && (
            <IconButton
              color="primary"
              onClick={(e) => createMealHandleRecipeUnselected(e)}
              style={{ marginTop: '5%', padding: '5%' }}
            >
              <FaCheck />
            </IconButton>
            )}
        </div>
        {/* <Popover
          open={maxRecipesReachedForMealPopoverOpen}
          anchorEl={maxRecipesReachedForMealPopoverAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          onClose={handleMaxRecipesReachedForMealPopoverOpen}
          disableRestoreFocus
        >
          Max recipes reached!
        </Popover> */}
      </Card>
    </Link>
  );
}

// TODO: check if this makes all these props exist with default values if none is given.
//       Would have to change the check if preview exists, for example.
Recipe.propTypes = {
  onMouseOver: PropTypes.func,
  onMouseOut: PropTypes.func,
  checkIfCurrentCard: PropTypes.func,
  addRecipeToState: PropTypes.func,
  createMealPromptIsOpen: PropTypes.bool,
  createMealHandleRecipeSelected: PropTypes.func,
  createMealHandleRecipeUnselected: PropTypes.func,
  recipe: PropTypes.shape({
    _id: Schema.Types.ObjectId.isRequired,
    preview: PropTypes.shape({
      key: PropTypes.string,
      location: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    ratingTotal: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};
Recipe.defaultProps = {
  onMouseOver: () => {},
  onMouseOut: () => {},
  checkIfCurrentCard: () => {},
  addRecipeToState: () => {},
  createMealPromptIsOpen: false,
  createMealHandleRecipeSelected: () => {},
  createMealHandleRecipeUnselected: () => {},
  recipe: PropTypes.shape({
    preview: null,
    description: '',
    ratingTotal: 0,
    tags: [],
  }),
};

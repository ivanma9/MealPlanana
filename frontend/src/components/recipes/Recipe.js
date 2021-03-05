import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@material-ui/core';

import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import ReactHtmlParser from 'react-html-parser';
import FavoriteIcon from '@material-ui/icons/Favorite';

export default function Recipe(props) {
  return (
    <Link
      to="/recipes/view"
      style={{ color: 'black', textDecoration: 'none' }}
    >
      <Card
        raised={props.checkIfCurrentCard(props.recipe._id)}
        onMouseOver={() => props.onMouseOver(props.recipe._id)}
        onMouseLeave={() => props.onMouseOut()}
        onClick={() => props.addRecipeToState(props.recipe._id)}
        style={{
          width: '18rem', borderRadius: '10px', padding: '1rem', margin: '2rem',
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
                backgroundColor: 'lawngreen', marginLeft: '1%', marginRight: '1%', marginBottom: '2%',
              }}
              key={i}
            />
          ))}
        </div>
        <Rating
          name="hearts"
          defaultValue={0}
          value={props.recipe.ratingTotal}
          precision={0.2}
          icon={<FavoriteIcon fontSize="inherit" />}
          readOnly
          style={{ color: 'red', marginTop: '5%', padding: '5%' }}
        />
      </Card>
    </Link>
  );
}

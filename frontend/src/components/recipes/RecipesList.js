import React, { Component } from 'react';

import { connect } from 'react-redux';
// import { getRecipes } from '../../actions/recipes';
import fetchRecipes from '../../actions/recipes';

// const mapStateToProps = ({ recipes }) => ({
//   recipes,
// });

const mapStateToProps = (state) => ({
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

// const mapDispatchToProps = (dispatch) => ({
//   getRecipes: () => dispatch(getRecipes()),
// });

// const mapDispatchToProps = (dispatch) => ({
//   fetchRecipes: () => dispatch(fetchRecipes()),
// });

class RecipesList extends Component {
  componentDidMount() {
    // getRecipes();
    console.log('component did mount');
    this.props.dispatch(fetchRecipes());
  }

  render() {
    const { error, loading, recipes } = this.props;
    console.log(error);
    console.log(loading);
    console.log(recipes);

    if (error) {
      return (
        <div>
          Error!
          {' '}
          {error.message}
        </div>
      );
    }
    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      // <div>
      //   <h1>Recipes</h1>
      //   <p>{recipes}</p>
      // </div>
      <ul>
        {recipes.map((recipe) => <li key={recipe._id}>{recipe.title}</li>)}
      </ul>
    );
  }
}

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(RecipesList);

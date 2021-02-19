import React, { Component } from 'react';

import { connect } from 'react-redux';
import { fetchRecipes } from '../../actions/recipes';

const mapStateToProps = (state) => ({
  recipes: state.recipes.items,
  loading: state.recipes.loading,
  error: state.recipes.error,
});

// const mapDispatchToProps = (dispatch) => ({
//   fetchRecipes: dispatch(fetchRecipes()),
// });

// const RecipesList = ({ error, loading, recipes }) => (
//   <>
//     {recipes.map((recipe) => <li key={recipe._id}>{recipe.title}</li>)}
//   </>
// );

class RecipesList extends Component {
  componentDidMount() {
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

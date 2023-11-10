import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';
import deleteUploadRecipeView from './views/deleteUploadRecipeView.js';

const controllerRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); //change the id by hash code

    // change load search to selected search
    resultsView.render(model.getSearchResultsPage());

    //select pressed bookmark recipe from bookmarks list
    bookmarksView.render(model.state.bookmarks);

    // 1-Render spinner
    recipeView.renderSpinner();

    // 2-Load recipe
    await model.loadRecipe(id);

    // 3-Render recipe
    recipeView.render(model.state.recipe);
  } catch (e) {
    recipeView.renderError();
  }
};

const controllerSearchResults = async function () {
  try {
    // 1- render spinner
    resultsView.renderSpinner();

    // 2- get search query
    const query = searchView.getQuery();

    if (!query) return;

    // 3- load search recipes
    await model.searchLoadRecipe(query);

    // 4- render search recipes
    resultsView.render(model.getSearchResultsPage());

    // 5- Render Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controllerPaginationResults = function (goToPage) {
  // render new  results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

const controllerServings = function (newServings) {
  // update state values of servings
  model.updateServings(newServings);

  // update render recipes
  recipeView.render(model.state.recipe);
};

const controllerAddBookmark = function () {
  //add bookmark
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //render bookmark check button
  recipeView.render(model.state.recipe);

  //render bookmark list
  bookmarksView.render(model.state.bookmarks);
};

const controllerAddRecipe = async function (newRecipe) {
  try {
    //render spinner when upload new recipe
    addRecipeView.renderSpinner();

    // upload new recipe
    await model.uploadRecipe(newRecipe);

    //render success message when upload new one
    addRecipeView.renderMessage();

    //render recipe to recipeview
    recipeView.render(model.state.recipe);

    //render recipe to bookmarks
    bookmarksView.render(model.state.bookmarks);

    //change id when upload new recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Set a timeout to close the modal after a specific time (CLOSE_MODAL_SEC seconds)
    setTimeout(function () {
      addRecipeView._toggleHidden();
      location.reload();
    }, CLOSE_MODAL_SEC * 1000);
  } catch (err) {
    console.log('Error', err);
    addRecipeView.renderError(err.message);
  }
};
const controllerDeleteRecipe = async function (recipeId) {
  try {
    //render spinner when delete recipe
    deleteUploadRecipeView.renderSpinner();

    // delete recipe
    await model.deleteRecipe(recipeId);

    //render success message when delete one
    deleteUploadRecipeView.renderMessage(
      'Recipe was deleted successfully from recipes!'
    );

    //render recipe to bookmarks
    model.deleteBookmark(recipeId);

    //change id when delete recipe
    window.history.pushState(null, '', '#');

    // Set a timeout to close the modal after a specific time (CLOSE_MODAL_SEC seconds)
    setTimeout(function () {
      deleteUploadRecipeView._toggleHidden();
      location.reload();
    }, CLOSE_MODAL_SEC * 1000);
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
};

const newFeature = function(){
  console.log('Welcome to new feature');
}

const init = function () {
  recipeView.addHandlerRender(controllerRecipes);
  recipeView.addHandlerUpdateServings(controllerServings);
  recipeView.addHandlerAddBookmark(controllerAddBookmark);
  searchView.addHandlerSearch(controllerSearchResults);
  paginationView.addHandlerPagination(controllerPaginationResults);
  addRecipeView.addHandlerRender(controllerAddRecipe);
  deleteUploadRecipeView.addHandlerDeleteRecipe(controllerDeleteRecipe);

  // console.log(model.state.recipe);
  // console.log(model.state.search.results.length);
  newFeature();
};

init();

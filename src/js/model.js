import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX, DELETE, deleteJSON } from './helpers.js';
import { getJSON, sendJson } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipe = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipe(data);

    //mark multiple bookmarked recipes
    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    
    // console.log('Loaded recipe:', state.recipe);
  } catch (err) {
    console.log(`Error loading the recipe, ${err.message}`);
    throw err;
  }
};

export const searchLoadRecipe = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        imageUrl: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
    // console.log('Search results:', state.search.results);

  } catch (err) {
    console.log(`Error loading the recipe, ${err.message}`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  //add recipe to bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.indexOf((bookmark) => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  //mark current repice as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  let storedBookmarks = localStorage.getItem('bookmarks');
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);
};

const resetLocalStorage = function () {
  localStorage.clear('bookmarks');
};
// resetLocalStorage();

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map((ing) => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map((el) => el.trim());
        if (ingArr.length !== 3) {
          throw new Error('Wrong ingredient format.Please recheck them!');
        }

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookMark(state.recipe);
    // console.log(data);

    // console.log(recipe);
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const deleteRecipe = async function (recipeId) {
  try {
    const url = `${API_URL}/${recipeId}?key=${KEY}`;
    await deleteJSON(url);
  } catch (error) {
    throw error;
  }
};





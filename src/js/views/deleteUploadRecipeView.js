import View from './view';
import { state } from '../model';

class DeleteUploadRecipeView extends View {
    _parentEl = document.querySelector('.recipe');
  
    addHandlerDeleteRecipe(handler) {
      this._parentEl.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn--delete');
        if (!btn) return;
        // Get the recipe ID from the state and pass it to the handler
        const recipeId = state.recipe.id;
        handler(recipeId);
      });
    }
    _toggleHidden() {
      this._parentEl.classList.toggle('hidden');
    }
  }
  
  export default new DeleteUploadRecipeView();
  

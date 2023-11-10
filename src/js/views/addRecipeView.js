import icons from 'url:../../img/icons.svg';
import View from './view';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _openBtn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');

  constructor() {
    super();
    this._addHandlerShowRecipe();
    this._addHandlerHideRecipe();
  }

  _toggleHidden() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerShowRecipe() {
    this._openBtn.addEventListener('click', this._toggleHidden.bind(this));
  }

  _addHandlerHideRecipe() {
    this._closeBtn.addEventListener('click', this._toggleHidden.bind(this));
    this._overlay.addEventListener('click', this._toggleHidden.bind(this));
  }

  addHandlerRender(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();

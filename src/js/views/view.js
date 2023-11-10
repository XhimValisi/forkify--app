import icons from 'url:../../img/icons.svg';
export default class View {
  _parentEl = document.querySelector('.recipe');
  _data;
  _errMessage = 'No recipe found.Please try another one!';
  _message = 'New recipe added successfully to recipes!';

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    // console.log(this._data);
    this.clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this.clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errMessage) {
    const markup = `
         <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 

    `;
    this.clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>
            ${message}
          </p>
        </div>

    `;
    this.clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}

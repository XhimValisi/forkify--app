import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerPagination(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const nrOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //first page and other pages
    if (curPage === 1 && nrOfPages > 1) {
      return `${this._generateNextPage(curPage)}
      `;
      console.log(('first page'));
    }
    //last page
    if (curPage === nrOfPages && nrOfPages > 1) {
      return `${this._generatePrevPage(curPage)};
      `;
      console.log(('last page'));
    }
    //other page
    if (curPage < nrOfPages) {
      return `${this._generatePrevPage(curPage)}${this._generateNextPage(
        curPage
      )}
      `;
      console.log(('other page'));
    }
    //first page has not other pages

    return '';
  }

  _generateNextPage(curPage) {
    return `
       <button data-goto="${
         curPage + 1
       }" class="btn--inline  pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-right"></use>
            </svg>
          </button>
    `;
  }
  _generatePrevPage(curPage) {
    return `
       <button data-goto="${
         curPage - 1
       }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="src/img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
    `;
  }
}

export default new PaginationView();

import icons from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks');
  _errMessage =
    'No bookmarked recipe found for your query.Please try to add recipe to bookmark!';

  _generateMarkup() {
     // Check if _data is an array or a single object
     const dataArray = Array.isArray(this._data) ? this._data : [this._data];

    return dataArray
      .map((bookmark) => previewView.render(bookmark, false))
      .join('');
  }

}

export default new BookmarksView();

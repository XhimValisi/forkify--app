import icons from 'url:../../img/icons.svg';
import View from './view';
import previewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errMessage = 'No recipe found for your query.Please try another one!';

  _generateMarkup() {
    return this._data.map((res) => previewView.render(res,false)).join('');
  }

}

export default new ResultsView();

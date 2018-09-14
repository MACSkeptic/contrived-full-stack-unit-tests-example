import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import registerServiceWorker from './registerServiceWorker';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as ContextProvider } from './context.js';
import { configureStore } from './redux/store.js';
import { Route, BrowserRouter } from 'react-router-dom';

const store = configureStore();

const render = () => (ReactDOM.render((
  <ContextProvider>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <React.Fragment>
          <Route path="/" component={App} />
        </React.Fragment>
      </BrowserRouter>
    </ReduxProvider>
  </ContextProvider>
), document.getElementById('root')));

if ((process.env.NODE_ENV !== 'production') && module.hot) {
  module.hot.accept('./App.js', () => render());
}

render();

registerServiceWorker();

import React from 'react';
import reducers from "./redux/reducers/index";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import './assets/styles.scss';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Match from './pages/Match';
import Details from './pages/Details';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';


const store = createStore(reducers, applyMiddleware(thunk));

const Layout = props => {
  return (
    <>
      <Navbar></Navbar>
      <div className="container pt-5">
        {props.children}
      </div>
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/" exact>
              <Layout>
                <Home/>
              </Layout>
            </Route>
            <Route path="/match">
              <Layout>
                <Match/>
              </Layout>
            </Route>
            <Route path="/details">
              <Layout>
                <Details/>
              </Layout>
            </Route>
            <Route path="/register">
              <Layout>
                <Register/>
              </Layout>
            </Route>
            <Route path="/login">
              <Layout>
                <Login/>
              </Layout>
            </Route>
            <Route path="/profile">
              <Layout>
                <Profile/>
              </Layout>
            </Route>
          </Switch>
        </Router>
      </Provider>
  );
}

export default App;

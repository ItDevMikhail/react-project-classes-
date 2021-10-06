import React, { Component } from "react";
import './App.css';
import { BrowserRouter as Router, Route, NavLink, Redirect, Switch } from 'react-router-dom';
import LoginPage from "./pages/loginPage";
import LibraryPage from "./pages/libraryPage";
import HomePage from "./pages/homePage";
import BookPage from "./pages/bookPage";

class App extends Component {

    render() {
        return (
            <>
                <Router>
                    <div className="header">
                        <div className="container">
                            {true && <nav className="navMenu"><div className="navMenuleft">
                                <NavLink activeClassName="selected" to='/home' exact={true}><span className="material-icons">
                                    home
                                </span></NavLink>
                                <NavLink activeClassName="selected" to='/library' exact={true}>Library</NavLink>
                                <NavLink activeClassName="selected" to='/library/add' exact={true}>Add book</NavLink>
                            </div><div className="navMenuRight"><NavLink activeClassName="selected" to='/login' onClick={()=>{console.log('здесь должна быть функция логаут')}}><span className="material-icons">
                                logout
                            </span></NavLink></div></nav>}
                            {!false && <nav className="navMenu"><div></div><div className="navMenuRight"><NavLink activeClassName="selected" to='/login'><span className="material-icons">
                                login
                            </span></NavLink>
                                <NavLink activeClassName="selected" to='/register'><span className="material-icons">
                                    person_add_alt
                                </span></NavLink></div></nav>}
                        </div>
                    </div>
                    <Switch>
                        <Route path='/home' >
                            <HomePage />
                        </Route>
                        <Route path='/login' >
                            <LoginPage />
                        </Route>
                        <Route path='/library/detail/:id' >
                            <BookPage/>
                        </Route>
                        <Route path='/library' exact={true}>
                            <LibraryPage />
                        </Route>
                        <Redirect to='/login' />
                    </Switch>
                </Router>
            </>
        )
    }
}
export default App;
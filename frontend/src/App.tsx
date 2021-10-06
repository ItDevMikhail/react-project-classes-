import React, { Component } from "react";
import './App.css';
import { BrowserRouter as Router, Route, NavLink, Redirect, Switch } from 'react-router-dom';
import LoginPage from "./pages/loginPage";
import LibraryPage from "./pages/libraryPage";
import HomePage from "./pages/homePage";
import BookPage from "./pages/bookPage";
import RegisterPage from "./pages/registerPage";
import AddBookPage from "./pages/addBookPage";

class App extends Component<{}, {isLogged: boolean}> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLogged: true
        }
        this.logged = this.logged.bind(this);
        this.logout = this.logout.bind(this);
        this.checkauth = this.checkauth.bind(this);
    }
    logged = (val: boolean) => {
        this.setState({ isLogged: val });
    }
    logout = async () => {
        this.setState({ isLogged: false });
        try {
            const response = await fetch('/api/users/logout', { method: 'GET' });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Ops...')
            }
            if (data) {
                sessionStorage.clear();
            }
        } catch (e: any) {
            console.log(e.message);
        }
    }
    checkauth = async () => {
        try {
            const response = await fetch('/api/users/auth', { method: 'GET' });
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || 'Ops...')
            }
            if (data) {
                this.setState({ isLogged: data.access });
            } else {
                this.setState({ isLogged: false });
            }
        } catch (e: any) {
            this.setState({ isLogged: false });
            console.log(e.message);
        }
    }
    componentDidMount() {
        this.checkauth();
    }

    render() {
        return (
            <>
                <Router>
                    <div className="header">
                        <div className="container">
                            {this.state.isLogged && <nav className="navMenu"><div className="navMenuleft">
                                <NavLink activeClassName="selected" to='/home' exact={true}><span className="material-icons">
                                    home
                                </span></NavLink>
                                <NavLink activeClassName="selected" to='/library' exact={true}>Library</NavLink>
                                <NavLink activeClassName="selected" to='/library/add' exact={true}>Add book</NavLink>
                            </div><div className="navMenuRight"><NavLink activeClassName="selected" to='/login' onClick={this.logout}><span className="material-icons">
                                logout
                            </span></NavLink></div></nav>}
                            {!this.state.isLogged && <nav className="navMenu"><div></div><div className="navMenuRight"><NavLink activeClassName="selected" to='/login'><span className="material-icons">
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
                        <Route path='/library/add' >
                            <AddBookPage />
                        </Route>
                        <Route path='/register' >
                            <RegisterPage />
                        </Route>
                        <Route path='/login' >
                            <LoginPage logged={this.logged} />
                        </Route>
                        <Route path='/library/detail/:id' >
                            <BookPage />
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
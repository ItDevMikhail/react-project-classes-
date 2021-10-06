import { Component } from "react";
import { Button, Input, InputLabel, FormGroup, Card, CardHeader } from '@material-ui/core';

interface ILoginPageState {
    login: string,
    password: string,
    loginWrong: boolean,
    loginError: string,
    passwordWrong: boolean,
    passwordError: string,
    formValid: boolean
}
type changeTarget = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type focusTarget = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;

class LoginPage extends Component<{logged(val: boolean): void}, ILoginPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            login: '',
            password: '',
            loginWrong: false,
            loginError: 'введите логин',
            passwordWrong: false,
            passwordError: 'введите пароль',
            formValid: false
        }
        this.loginHandler = this.loginHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
        this.focusHandler = this.focusHandler.bind(this);
        this.authHandler = this.authHandler.bind(this);
    }

    loginHandler = (e: changeTarget) => {
        this.setState({ login: e.target.value });
        if (!e.target.value) {
            this.setState({ loginError: 'введите логин' });

        } else {
            this.setState({ loginError: '' });
        }
    }

    passwordHandler = (e: changeTarget) => {
        this.setState({ password: e.target.value });
        if (!e.target.value) {
            this.setState({ passwordError: 'введите пароль' });
        } else {
            this.setState({ passwordError: '' });
        }
    }

    focusHandler = (e: focusTarget) => {
        switch (e.target.name) {
            case 'login':
                this.setState({ loginWrong: true });
                break;
            case 'password':
                this.setState({ passwordWrong: true });
                break;
            default:
                break;
        }
    }
    authHandler = async () => {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                body: JSON.stringify({ login: this.state.login, password: this.state.password }),
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }
            if (data) {
                console.log('вы успешно авторизовались');
                window.location.search = '';
                window.location.pathname = '/library';
                this.props.logged(true);
            }
        } catch (e: any) {
            console.log(e.message);
        }
    }
    componentDidMount() {
        if (this.state.loginError || this.state.passwordError) {
            this.setState({ formValid: false });
        } else {
            this.setState({ formValid: true });
        }
    }
    componentDidUpdate() {
        if (this.state.loginError || this.state.passwordError) {
            if (this.state.formValid === true) {
                return this.setState({ formValid: false });
            }
            return
        } else if (this.state.formValid !== true) {
            return this.setState({ formValid: true });
        }
    }
    render() {

        return (
            <Card className="loginCard">
                <CardHeader title="Авторизация" className="loginCardHeader"></CardHeader>
                <form className="loginForm">
                    <FormGroup>
                        <InputLabel htmlFor="login">Логин*</InputLabel>
                        <Input id="login"
                            onFocus={e => this.focusHandler(e)}
                            type="text"
                            name="login"
                            placeholder="Введите логин"
                            onChange={e => this.loginHandler(e)}
                            value={this.state.login}
                            required />
                        {(this.state.loginWrong && this.state.loginError) && <div style={{ color: 'red' }}>{this.state.loginError}</div>}
                    </FormGroup>
                    <br />
                    <FormGroup>
                        <InputLabel htmlFor="password">Пароль*</InputLabel>
                        <Input id="password" type="password"
                            onFocus={e => this.focusHandler(e)}
                            placeholder="Введите пароль"
                            name="password"
                            onChange={e => this.passwordHandler(e)}
                            value={this.state.password}
                            required />
                        {(this.state.passwordWrong && this.state.passwordError) && <div style={{ color: 'red' }}>{this.state.passwordError}</div>}
                    </FormGroup>
                    <br />
                    <Button color="primary" variant="contained" disabled={!this.state.formValid} onClick={this.authHandler}>Войти</Button>
                    <br />
                </form>
            </Card>
        )
    }
}
export default LoginPage;
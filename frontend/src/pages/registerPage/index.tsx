import { Component } from "react";
import { Button, Input, InputLabel, FormGroup, Card, CardHeader } from '@material-ui/core';

interface IRegisterPageState {
    login: string,
    name: string,
    lName: string,
    email: string,
    password: string,
    confPassword: string,
    loginWrong: boolean,
    nameWrong: boolean,
    lNameWrong: boolean,
    emailWrong: boolean,
    passwordWrong: boolean,
    confPassWrong: boolean,
    loginError: string,
    nameError: string,
    lNameError: string,
    emailError: string,
    passwordError: string,
    confPassError: string,
    formValid: boolean
}
type changeTarget = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type focusTarget = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;

class RegisterPage extends Component<{}, IRegisterPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            login: '',
            name: '',
            lName: '',
            email: '',
            password: '',
            confPassword: '',
            loginWrong: false,
            nameWrong: false,
            lNameWrong: false,
            emailWrong: false,
            passwordWrong: false,
            confPassWrong: false,
            loginError: 'введите логин',
            nameError: 'введите имя',
            lNameError: 'введите фамилию',
            emailError: 'введите email',
            passwordError: 'введите пароль',
            confPassError: 'подтвердите пароль',
            formValid: false
        }
        this.focusHandler = this.focusHandler.bind(this);
        this.registerHandler = this.registerHandler.bind(this);
        this.loginHandler = this.loginHandler.bind(this);
        this.nameHandler = this.nameHandler.bind(this);
        this.lastNameHandler = this.lastNameHandler.bind(this);
        this.emailHandler = this.emailHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
        this.confPasswordHandler = this.confPasswordHandler.bind(this);
    }

    loginHandler = (e: changeTarget) => {
        this.setState({ login: e.target.value });
        const validLogin: RegExp = /^[a-zA-Z]+([-_]?[a-z0-9]+){1,2}$/;
        if (validLogin.test(String(e.target.value))) {
            this.setState({ loginError: '' });
        } else if (!e.target.value) {
            this.setState({ loginError: 'введите логин' });
        } else {
            this.setState({ loginError: 'некорректный логин' });
        }
    }
    nameHandler = (e: changeTarget) => {
        this.setState({ name: e.target.value });
        if (e.target.value.length < 3) {
            this.setState({ nameError: 'некорректное имя' });
        } else if (!e.target.value) {
            this.setState({ nameError: 'введите имя' });
        } else {
            this.setState({ nameError: '' });
        }
    }
    lastNameHandler = (e: changeTarget) => {
        this.setState({ lName: e.target.value });
        if (e.target.value.length < 3) {
            this.setState({ lNameError: 'некорректная фимилия' });
        } else if (!e.target.value) {
            this.setState({ lNameError: 'введите фимилию' });
        } else {
            this.setState({ lNameError: '' });
        }
    }

    emailHandler = (e: changeTarget) => {
        this.setState({ email: e.target.value });
        const validEmail: RegExp = /.+@.+\..+/;
        if (validEmail.test(String(e.target.value))) {
            this.setState({ emailError: '' });
        } else if (!e.target.value) {
            this.setState({ emailError: 'введите email' });
        } else {
            this.setState({ emailError: 'некорректный email' });
        }
    }

    passwordHandler = (e: changeTarget) => {
        this.setState({ password: e.target.value });
        const validPass: RegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/;
        if (validPass.test(String(e.target.value))) {
            this.setState({ passwordError: '' });
        } else if (!e.target.value) {
            this.setState({ passwordError: 'введите пароль' });
        } else {
            this.setState({ passwordError: 'некорректный пароль' });
        }
    }
    confPasswordHandler = (e: changeTarget) => {
        this.setState({ confPassword: e.target.value });
        if (e.target.value === this.state.password && e.target.value.length > 0) {
            this.setState({ confPassError: '' });
        } else if (!e.target.value) {
            this.setState({ confPassError: 'подвердите пароль' });
        } else {
            this.setState({ confPassError: 'пароли не совпадают' });
        }
    }

    focusHandler = (e: focusTarget) => {
        switch (e.target.name) {
            case 'login':
                this.setState({ loginWrong: true });
                break;
            case 'name':
                this.setState({ nameWrong: true });
                break;
            case 'lastName':
                this.setState({ lNameWrong: true });
                break;
            case 'email':
                this.setState({ emailWrong: true });
                break;
            case 'password':
                this.setState({ passwordWrong: true });
                break;
            case 'confPassword':
                this.setState({ confPassWrong: true });
                break;
            default:
                break;
        }
    }

    registerHandler = async () => {
        try {
            const body = JSON.stringify({ login: this.state.login, name: this.state.name, lastName: this.state.lName, email: this.state.email, password: this.state.password });
            const response = await fetch('/api/users/reg', {
                method: 'POST',
                body: body,
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }
            if (data) {
                window.location.search = '';
                window.location.pathname = '/login';
                
            }
        } catch (e: any) {
            console.log(e.message);
        }
    }

    componentDidMount() {
        console.log('valid')
        this.setState({ formValid: false });

    }

    componentDidUpdate() {
        console.log('update')
        if (this.state.loginError || this.state.nameError || this.state.lNameError || this.state.emailError || this.state.passwordError || this.state.confPassError) {
            if (this.state.formValid === true) {
                console.log('update false')
                return this.setState({ formValid: false });
            }
            return
        } else if (this.state.formValid !== true) {
            console.log('update true')
            return this.setState({ formValid: true });
        }
    }

    render() {
        return (
            <>
                <Card className="registerCard">
                    <CardHeader title="Регистрация" className="registerCardHeader"></CardHeader>
                    <form className="registerForm">
                        <FormGroup>
                            <InputLabel htmlFor="login">Логин*</InputLabel>
                            <Input id="login"
                                onFocus={e => this.focusHandler(e)}
                                type="text"
                                name='login'
                                placeholder="Введите логин"
                                onChange={e => this.loginHandler(e)}
                                value={this.state.login}
                                required />
                            {(this.state.loginWrong && this.state.loginError) && <div style={{color: 'red'}}>{this.state.loginError}</div>}
                        </FormGroup>
                        <br />
                        <FormGroup>
                            <InputLabel htmlFor="name">Имя*</InputLabel>
                            <Input id="name" type="text"
                                onFocus={e => this.focusHandler(e)}
                                placeholder="Введите имя"
                                name="name"
                                onChange={e => this.nameHandler(e)}
                                value={this.state.name}
                                required
                                className={(this.state.nameWrong && this.state.nameError) ? 'inputErrors' : ''} />
                        </FormGroup>
                        <br />
                        <FormGroup>
                            <InputLabel htmlFor="lastName">Фамилия*</InputLabel>
                            <Input id="lastName" type="text"
                                onFocus={e => this.focusHandler(e)}
                                placeholder="Введите фамилию"
                                name="lastName"
                                onChange={e => this.lastNameHandler(e)}
                                value={this.state.lName}
                                required
                                className={(this.state.lNameWrong && this.state.lNameError) ? 'inputErrors' : ''} />
                        </FormGroup>
                        <br />
                        <FormGroup>
                            <InputLabel htmlFor="email">E-mail*</InputLabel>
                            <Input id="email" type="text"
                                onFocus={e => this.focusHandler(e)}
                                placeholder="Введите e-mail"
                                name="email"
                                onChange={e => this.emailHandler(e)}
                                value={this.state.email}
                                required />
                            {(this.state.emailWrong && this.state.emailError) && <div style={{color: 'red'}}>{this.state.emailError}</div>}
                        </FormGroup>
                        <br />
                        <FormGroup>
                            <InputLabel htmlFor="password">Пароль* (окно с правилами ввода)</InputLabel>
                            <Input id="password" type="password"
                                onFocus={e => this.focusHandler(e)}
                                placeholder="Введите пароль"
                                name="password"
                                onChange={e => this.passwordHandler(e)}
                                value={this.state.password}
                                required />
                            {(this.state.passwordWrong && this.state.passwordError) && <div style={{color: 'red'}}>{this.state.passwordError}</div>}
                        </FormGroup>
                        <br />
                        <FormGroup>
                            <InputLabel htmlFor="confPassword">Подтвердите пароль*</InputLabel>
                            <Input id="confPassword" type="password"
                                onFocus={e => this.focusHandler(e)}
                                placeholder="Подтвердите пароль"
                                name="confPassword"
                                onChange={e => this.confPasswordHandler(e)}
                                value={this.state.confPassword}
                                required />
                            {(this.state.confPassWrong && this.state.confPassError) && <div style={{color: 'red'}}>{this.state.confPassError}</div>}
                        </FormGroup>
                        <br />
                        <Button color="primary" variant="contained" disabled={!this.state.formValid} onClick={this.registerHandler}>Отправить</Button>
                        <br />
                    </form>
                </Card>
            </>
        )
    }
}
export default RegisterPage;
import { Component } from "react";
import { IAddBookProps } from '../../models/iAddbook';
import { Button, Input, InputLabel, FormGroup, Card, CardHeader, TextField } from '@material-ui/core';

interface IAddBookPageState {
    book: IAddBookProps,
    nameError: boolean,
    descrError: boolean,
    formValid: boolean
}
type changeTarget = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type focusTarget = React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>;

class AddBookPage extends Component<{}, IAddBookPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            book: {
                name: '', description: ''
            },
            nameError: true,
            descrError: true,
            formValid: false,
        }
        this.nameHandler = this.nameHandler.bind(this);
        this.descriptionHandler = this.descriptionHandler.bind(this);
        this.addBookHandler = this.addBookHandler.bind(this);
    }

    nameHandler = (e: changeTarget) => {
        this.setState({ book: { name: e.target.value, description: this.state.book.description } });
        if (e.target.value.length < 3) {
            this.setState({ nameError: true });
        } else {
            this.setState({ nameError: false });
        }
    }
    descriptionHandler = (e: changeTarget) => {
        this.setState({ book: { name: this.state.book.name, description: e.target.value } });
        if (e.target.value.length < 5) {
            this.setState({ descrError: true });
        } else {
            this.setState({ descrError: false });
        }
    }
    addBookHandler = async () => {
        try {
            const response = await fetch('/api/library/add', {
                method: 'POST',
                body: JSON.stringify(this.state.book),
                headers: {
                    'Content-type': 'application/json'
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'чёт не то');
            }
            if (data) {
                window.location.search = '';
                window.location.pathname = `/library/detail/${data._id}`;
            }
        } catch (e: any) {
            console.log(e.message);
        }
    }

    componentDidMount() {
        this.setState({ formValid: false });
    }
    componentDidUpdate() {
        if (this.state.nameError || this.state.descrError) {
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
                <CardHeader title="Добавить книгу" className="loginCardHeader"></CardHeader>
                <form className="loginForm">
                    <FormGroup className={this.state.nameError ? 'addBookInput' : ''}>
                        <InputLabel htmlFor="login">Название книги*</InputLabel>
                        <Input id="name"
                            type="text"
                            name="name"
                            placeholder="Введите название книги"
                            onChange={e => this.nameHandler(e)}
                            value={this.state.book.name}
                            className="addBookInputName"
                            required />
                           
                    </FormGroup>
                    <br />
                    <FormGroup className={this.state.descrError ? 'addBookInput' : ''}>
                        <InputLabel htmlFor="password">Описание*</InputLabel>
                        <TextField className='createBookArea'
                            id="decription"
                            placeholder="Напишите описание книги"
                            onChange={e => this.descriptionHandler(e)}
                            name="description"
                            value={this.state.book.description}
                            required
                            multiline
                            minRows={4}
                            maxRows={6}
                        />
                    </FormGroup>
                    <br />
                    <Button color="primary" variant="contained" disabled={!this.state.formValid} onClick={this.addBookHandler}>Создать</Button>
                    <br />
                </form>
            </Card>
        )
    }
}
export default AddBookPage;
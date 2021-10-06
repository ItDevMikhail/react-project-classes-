import { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
interface IBookPageState {
    todos: { _id: string, name: string, description: string },
    loading: boolean,
}



class BookPage extends Component<{}, IBookPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            todos: { _id: '1', name: '', description: '' },
            loading: false,
        }
        this.getBook = this.getBook.bind(this);
    }
    getBook = async () => {
        this.setState({ loading: true });
        const url = window.location.pathname;
        try {
            const response = await fetch(`/api${url}`, {
                method: 'GET'
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'чёт не то');
            }
            this.setState({ loading: false })
            if (data) {
                this.setState({ todos: data })
            }
            return data;
        } catch (e: any) {
            this.setState({ loading: false })
            console.log(e.message);
        }
    }

    componentDidMount() {
        this.getBook();
    }

    render() {
        return (
            <>
                <div className="container detailPage">
                    <h2>Book page</h2>
                    <div className={this.state.loading ? 'progressBar active' : 'progressBar'}>
                        <CircularProgress />
                    </div>
                    <div className={!this.state.loading ? 'active' : 'hidden'}>
                        <h3>Название книги: {this.state.todos.name}</h3>
                        <p>Описание книги: {this.state.todos.description}</p>
                    </div>
                </div>
            </>
        )
    }
}
export default BookPage;
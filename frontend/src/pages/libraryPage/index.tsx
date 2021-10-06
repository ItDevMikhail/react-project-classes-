import { Component } from "react";
import { CircularProgress } from '@material-ui/core';
import { IBookListProps } from '../../models/iBooks';
import { Link } from 'react-router-dom';

interface ILibraryPageState {
    todos: [{ _id: string, name: string, description: string }],
    loading: boolean,
    favorite: Array<object>;
}

class LibraryPage extends Component<{}, ILibraryPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            todos: [{ _id: '1', name: '', description: '' }],
            loading: false,
            favorite: [{}]
        }
        this.getBooks = this.getBooks.bind(this);
    }
    getBooks = async () => {
        this.setState({ loading: true });
        try {
            const response = await fetch('/api/library', { method: 'GET' });
            const data = await response.json();
            this.setState({ loading: false });
            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }
            if (data) {
                this.setState({ todos: data })
                sessionStorage.setItem('todos', JSON.stringify(data));
            }
            return data;
        } catch (e: any) {
            this.setState({ loading: false });
            console.log(e.message);
        }
    }
    componentDidMount() {
        this.getBooks();
    }
    render() {
        return (
            <>
                <div className="container libraryPage">
                    <h2>Library page</h2>
                    <div className={this.state.loading ? 'progressBar active' : 'progressBar'}>
                        <CircularProgress />
                    </div>
                    <ul> {this.state.todos.map((item: IBookListProps) =>
                        <li key={item.name}>
                             <Link to={`/library/detail/${item._id}`}>{item.name}</Link>
                        </li>)}</ul>
                </div>
            </>
        )
    }
}
export default LibraryPage;
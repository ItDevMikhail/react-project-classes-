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
        this.getFavorite = this.getFavorite.bind(this);
        this.addFavorite = this.addFavorite.bind(this);
        this.Favorite = this.Favorite.bind(this);
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

    getFavorite = async () => {
        try {
            const response = await fetch('/api/library/favorite', { method: 'GET' });
            const data = await response.json();
            this.setState({ loading: false });
            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }
            if (data) {
                this.setState({ favorite: data })
                sessionStorage.setItem('favorite', JSON.stringify(data));
            }
            return data;
        } catch (e: any) {
            console.log(e.message);
        }
    }

    addFavorite = async (bookId: string) => {
        try {
            const response = await fetch(`/api/library/addFavorite/${bookId}`, {
                method: 'GET',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }
            if (data) {
                this.setState({favorite: data});
                sessionStorage.setItem('favorite', JSON.stringify(data));
            }
        } catch (e: any) {
            this.setState({favorite: [{}]});
            console.log(e.message);
        }
    }

    Favorite = (itemId: string) => {
        if (this.state.favorite.length) {
            let favor = this.state.favorite.filter((data: any) => data.bookId === itemId)
            if (favor.length > 0) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    componentDidMount() {
        const todo = sessionStorage.getItem('todos');
        const favor = sessionStorage.getItem('favorite');
        if (favor) {
            this.setState({favorite: JSON.parse(favor)});
        }
        if (todo) {
            this.setState({todos: JSON.parse(todo)});
        } 
        this.getBooks();
        this.getFavorite();
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
                            <Link to={`/library/detail/${item._id}`}>{item.name}</Link><div className={this.Favorite(item._id) ? 'addedFavorite' : ''}><span className="material-icons" onClick={() => { this.addFavorite(item._id) }}>
                                star
                            </span></div>
                        </li>)}</ul>
                </div>
            </>
        )
    }
}
export default LibraryPage;
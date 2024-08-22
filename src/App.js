import {useEffect, useState} from "react";
import MovieList from "./MovieList";
import WatchedMovieList from "./WatchedMovieList";
import NavBar from "./NavBar";
import MovieDetails from "./MovieDetails";
import Loader from "./Loader";
import apiKey from "./apiKey";


const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


const App = () => {
    const [movies, setMovies]         = useState([]);
    const [watched, setWatched]       = useState([]);
    const [isLoading, setIsLoading]   = useState(false);
    const [errorMsg, setErrorMsg]     = useState('');
    const [query, setQuery]           = useState("inception");
    const [selectedId, setSelectedId] = useState(null);

    // When a user clicks a movie in the Search Results list,
    // select / deselect that movie
    const handleSelectMovie = (imdbID) => {
        setSelectedId((selectedId) => (imdbID === selectedId) ? null : imdbID);
    };

    const handleCloseMovie = () => {
        setSelectedId(null);
    };

    const handleAddWatched = (movie) => {
        setWatched(watched => [...watched, movie]);
    }

    const handleDeleteWatched = (imdbID) => {
        setWatched(watched.filter((el) => el.imdbID !== imdbID));
    }

    useEffect(() => {
        async function fetchMovies() {
            try {
                setIsLoading(true);
                const res = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
                if (!res.ok) {
                    throw new Error('Something went wrong while fetching the movies')
                }
                const data = await res.json();
                if (data.Response !== 'True') {
                    throw new Error('No matches found');
                }
                setMovies(data.Search);
            } catch (err) {
                console.error(err);
                setErrorMsg(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        setErrorMsg('');
        if (query.length < 3) {
            setMovies([]);
            return;
        }
        fetchMovies();

    }, [query]);

    return (
        <>
            <NavBar>
                <SearchBox query={query} setQuery={setQuery}/>
                <NumResults movies={movies}/>
            </NavBar>
            <Main>
                <Box>
                    {isLoading && <Loader/>}
                    {errorMsg && <ErrorMessage message={errorMsg}/>}
                    {!isLoading && !errorMsg && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
                </Box>
                <Box>
                    {selectedId ?
                        <MovieDetails
                            selectedId={selectedId}
                            watched={watched}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                        /> :
                        (
                            <>
                                <WatchedSummary watched={watched}/>
                                <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched}
                                />
                            </>
                        )}
                </Box>
            </Main>
        </>
    );
}

const ErrorMessage = ({message}) => {
    return (
        <p className="error"><span>⛔</span>{message}</p>
    );
}

const SearchBox = ({query, setQuery}) => {
    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}

const NumResults = ({movies}) => {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

const Main = ({children}) => {

    return (
        <main className="main">
            {children}
        </main>
    );
}

const Box = ({children}) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="box">
            <button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </button>
            {isOpen && children}
        </div>
    )
}


const WatchedSummary = ({watched}) => {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime    = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}


export default App;

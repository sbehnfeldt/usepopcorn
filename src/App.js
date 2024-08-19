import {useEffect, useState} from "react";
import StarRating from "./StarRating";

const tempWatchedData = [
    {
        imdbID: "tt1375666",
        Title: "Inception",
        Year: "2010",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: "tt0088763",
        Title: "Back to the Future",
        Year: "1985",
        Poster:
            "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
        runtime: 116,
        imdbRating: 8.5,
        userRating: 9,
    },
];

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const apiKey = '1f72ade8';

const App = () => {
    const [movies, setMovies]         = useState([]);
    const [watched, setWatched]       = useState(tempWatchedData);
    const [isLoading, setIsLoading]   = useState(false);
    const [errorMsg, setErrorMsg]     = useState('');
    const [query, setQuery]           = useState("inception");
    const [selectedId, setSelectedId] = useState(null);

    const handleSelectMovie = (id) => {
        setSelectedId((selectedId) => (id === selectedId) ? null : id);
    };

    const handleCloseMovie = () => {
        setSelectedId(null);
    };

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
                    {selectedId ? <MovieDetails selectedId={selectedId} onCloseMovie={handleCloseMovie}/> : (
                        <>
                            <WatchedSummary watched={watched}/>
                            <WatchedMovieList watched={watched}/>
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

const Loader = () => {
    return (
        <p className="loader">Loading....</p>
    )
}

const ErrorMessage = ({message}) => {
    return (
        <p className="error"><span>⛔</span>{message}</p>
    );
}

const NavBar = ({children}) => {
    return (
        <nav className="nav-bar">
            <Logo/>
            {children}
        </nav>
    )
}

const Logo = () => {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
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

const MovieList = ({movies, onSelectMovie}) => {
    return (
        <ul className="list list-movies">
            {movies?.map((movie) => (
                <MovieListItem key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie}/>
            ))}
        </ul>
    )
}

const MovieListItem = ({movie, onSelectMovie}) => {
    return (
        <li onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`}/>
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );

}

const MovieDetails = ({selectedId, onCloseMovie}) => {
    const [movie, setMovie]         = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const {
              Title: title,
              Year: year,
              Poster: poster,
              Runtime: runtime,
              imdbRating,
              Plot: plot,
              Released: released,
              Actors: actors,
              Director: director,
              Genre: genre
          } = movie;

    console.log(title, year);

    useEffect(() => {
        const getMovieDetails = async () => {
            setIsLoading(true);
            const res  = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`);
            const data = await res.json();
            console.log(data);
            setMovie(data);
            setIsLoading(false);
        }
        getMovieDetails();
    }, [selectedId]);

    return (
        <div className="details">
            {isLoading ? <Loader/> : <>
                <header>
                    <button className="btn-back" onClick={onCloseMovie}>
                        &larr;
                    </button>
                    <img src={poster} alt={`Poster of ${title} movie`}/>
                    <div className="details-overview">
                        <h2>{title}</h2>
                        <p>{released} &bull; {runtime}</p>
                        <p>{genre}</p>
                        <p><span>⭐</span>{imdbRating} IMDB rating</p>
                    </div>
                </header>
                <section>
                    <div className="rating">
                        <StarRating maxRating={10} size={24}/>
                    </div>
                    <p><em>{plot}</em></p>
                    <p>Starring {actors}</p>
                    <p>Directed by {director}</p>
                </section>
            </>
            }
        </div>
    );
};

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

const WatchedMovieList = ({watched}) => {

    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID}/>
            ))}
        </ul>
    );
}

const WatchedMovie = ({movie}) => {
    return (
        <li key={movie.imdbID}>
            <img src={movie.Poster} alt={`${movie.Title} poster`}/>
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
            </div>
        </li>
    );
}

export default App;

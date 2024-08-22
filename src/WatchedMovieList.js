const WatchedMovieList = ({watched, onDeleteWatched}) => {

    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie movie={movie} key={movie.imdbID} onDeletedWatched={onDeleteWatched}/>
            ))}
        </ul>
    );
}

const WatchedMovie = ({movie, onDeletedWatched}) => {
    return (
        <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`}/>
            <h3>{movie.title}</h3>
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

                <button className="btn-delete" onClick={() => onDeletedWatched(movie.imdbID)}>X</button>
            </div>
        </li>
    );
}

export default WatchedMovieList;

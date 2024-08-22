import {useEffect, useState} from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import apiKey from "./apiKey";

const MovieDetails = ({selectedId, watched, onCloseMovie, onAddWatched}) => {
    const [movie, setMovie]           = useState({});
    const [isLoading, setIsLoading]   = useState(false);
    const [userRating, setUserRating] = useState('');

    const alreadyWatched    = watched.map((el) => el.imdbID).includes(selectedId);
    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating;

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

    const handleAdd = () => {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ').at(0)),
            userRating
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }


    // When the movie title changes, change the HTML page title accordingly
    useEffect(() => {
        if (title) {
            document.title = `Movie | ${title}`;
        } else {
            document.title = 'usePopcorn';
        }

        // Return cleanup function
        return () => {
            document.title = 'usePopcorn';
        }

    }, [title]);


    // When the selectedId changes, fetch OMDB data for that movie
    useEffect(() => {
        const getMovieDetails = async () => {
            setIsLoading(true);
            const res  = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`);
            const data = await res.json();
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
                        {alreadyWatched ?
                            <>
                                <p>Already watched:</p>
                                <p>{Array.from({length: watchedUserRating}, (_, index) => (
                                    <span key={index}>⭐</span>
                                ))}</p>
                            </>
                            :
                            <>
                                <StarRating
                                    maxRating={10}
                                    size={24}
                                    onSetRating={setUserRating}/>
                                {userRating > 0 &&
                                    (<button className="btn-add" onClick={handleAdd}>+ Add to list</button>)
                                }
                            </>
                        }
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
export default MovieDetails;

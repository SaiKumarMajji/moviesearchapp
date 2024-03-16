import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { ClipLoader } from "react-spinners";

const apiKey = "b3c987f78b164fa20eee5fcf499ab486";
const baseUrl = "https://api.themoviedb.org/3";

const MovieList = ({ movieTitle }) => {
  const [movieData, setMovieData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 3;
  const [isLoading, setIsLoading] = useState(true); // Set isLoading to true initially

  useEffect(() => {
    const fetchMovieData = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          setMovieData(data.results);
        } else {
          setMovieData([]);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setMovieData([]);
      } finally {
        setIsLoading(false); // Set isLoading to false after data is fetched
      }
    };

    const fetchRandomMovies = async () => {
      let randomPage = Math.floor(Math.random() * 100) + 1;
      let randomUrl = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=${randomPage}`;
      let data = [];

      while (data.length === 0) {
        const response = await fetch(randomUrl);
        const responseData = await response.json();
        data = responseData.results;

        if (data.length === 0) {
          randomPage = Math.floor(Math.random() * 100) + 1;
          randomUrl = `${baseUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=${randomPage}`;
        }
      }

      setMovieData(data);
      setIsLoading(false); // Set isLoading to false after data is fetched
    };

    if (!movieTitle) {
      fetchRandomMovies();
    } else {
      const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        movieTitle
      )}`;
      fetchMovieData(searchUrl);
    }
  }, [movieTitle]);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = movieData.slice(firstPostIndex, lastPostIndex);

  return (
    <div>
      {isLoading ? (
        <div className="spinner-container">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : currentPosts.length > 0 ? (
        <div>
          {currentPosts.map((movie) => (
            <div key={movie.id} className="movies">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={`${movie.title} Poster`}
                />
              )}
              <div className="movie-details">
                <h2>{movie.title}</h2>
                <p>RELEASE DATE: {movie.release_date}</p>
                <p>RATING: {movie.vote_average}</p>
                <p className="movie-overview">{movie.overview}</p>
              </div>
            </div>
          ))}
          <Pagination
            totalPosts={movieData.length}
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <p className="no-movies">No movies found.</p>
      )}
    </div>
  );
};

export default MovieList;

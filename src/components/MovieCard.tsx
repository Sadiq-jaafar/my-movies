



interface MovieCardProps {
  movie: {
    id: number
    title: string
    vote_average: number
    poster_path: string
    release_date:string
    original_language: string
    // Add other movie properties as needed
  }
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`:"/No-Poster.png"} alt={movie.title} className="" />
    
        <div className="mt-4">
            <h3>{movie.title}</h3>
            
            <div className="content">
                <div className="rating">
                 
                    <img src="star.svg" alt="star icon" />
                    <p>{movie.vote_average ? movie.vote_average.toFixed(1): 'N/A'}</p>
                </div>

                <span className="">•</span>
                <p className="lang">{movie.original_language}</p>
                <span className="">•</span>

                <p className="year">
                    {movie.release_date ? movie.release_date.split('-')[0]: "N/A"}
                </p>
            </div>
        </div>
    </div>
  )
}

export default MovieCard
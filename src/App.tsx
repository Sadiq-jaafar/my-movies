import { useEffect, useState } from "react"
import "./App.css"
import Search from "./components/Search"
import Spinner from "./components/Spinner"
import MovieCard from "./components/MovieCard"
import { useDebounce } from 'use-debounce';
import { getTrendingMovies, updateSearchCount } from "./Appwrite"

interface Movie {
  id: number
  title: string
  vote_average: number
  poster_path: string
  release_date: string
  original_language: string
}

interface TrendingMovie {
  $id: string;
  searchTerm: string;
  count: number;
  poster_url: string;
  movie_id: number;
  title:string
}


const API_BASE_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const[trendingMovies, setTrendingMovies] =useState<TrendingMovie[]>([])

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500)

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint, API_OPTIONS)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.results) {
        throw new Error("No movies found")
      }

      setMovieList(data.results)
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0])
      }
 
    } catch (error) {
      console.error("Error fetching movies:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch movies")
      setMovieList([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async ()=>{
    setIsLoading(true)
    try {
      const movies = await getTrendingMovies();
      //@ts-expect-error-type
      setTrendingMovies(movies)
    } catch (error) {
      console.log(`error fetching trending movies:${error}`);
      
      
    }
    finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(()=>{
    loadTrendingMovies()
  },[])

  return (
    <main>
      <div className="pattern bg-url('./hero-bg.png')">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          </header>
          {isLoading? <Spinner/>:trendingMovies.length > 0 && (
  <section className="trending">
    <h2>Trending</h2>
    <ul>
      {trendingMovies.map((movie, index) => (
        <li key={movie.$id}>
          <p>{index + 1}</p>
          <img src={movie.poster_url} alt={movie.title} />
          
        
        </li>
      ))}
    </ul>
  </section>
)}

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <section className="all-movies">
            <h2 >All Movies</h2>

            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App

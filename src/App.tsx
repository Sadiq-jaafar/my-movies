import { useEffect, useState } from "react"
import "./App.css"
import Search from "./components/Search"
import Spinner from "./components/Spinner"
import MovieCard from "./components/MovieCard"
import { useDebounce } from 'use-debounce';

interface Movie {
  id: number
  title: string
  vote_average: number
  poster_path: string
  release_date: string
  original_language: string
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
    } catch (error) {
      console.error("Error fetching movies:", error)
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch movies")
      setMovieList([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern bg-url('./hero-bg.png')">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          </header>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

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


import { useState } from "react"
import "./App.css"
import Search from "./components/Search"

const App = () => {

const [searchTerm, setSearchTerm] = useState('')

  return (
    <main>
      <div className="pattern">
        <div className="wrapper bg{./hero-bg.png}">
          <header>
          <img src = "./hero-img.png" alt="hero Banner"/>
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassele</h1>
          </header>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className="text-white">{searchTerm}</h1>
        </div>
      </div>

    </main>
  )
}

export default App
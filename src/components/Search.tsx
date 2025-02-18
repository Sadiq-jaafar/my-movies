

interface Props {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const Search = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <div className='search'>
        <div className="">
            <img src="search.svg" alt="search" />
            <input 
                type="text"
                placeholder='Search through thousands of movies'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search;
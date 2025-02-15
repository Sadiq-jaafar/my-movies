import React from 'react'


interface props{
    searchTerm: string;
    SetSearchTerm : string;
}

const Search = ({searchTerm,setSearchTerm}:props) => {
  return (
    <div className='search'>
        <div className="">
            <img src="search.svg" alt="search" />
            <input 
            type="text"
            placeholder='SEarch through Thousandsof movies'
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}/>
        </div>
    </div>
  )
}

export default Search
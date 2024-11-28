import { useCallback, useContext, useEffect, useState } from 'react';
import { searchSvg } from '../assets';
import { useNavigate } from 'react-router-dom';
import Loader from './skeletons/Loader';

const Search = (props) => {
  const { searchBox, setSearchBox } = props;
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const toggleSearchBox = useCallback(() => {
    setSearchBox((prevSearchBox) => !prevSearchBox); // Ensure toggling the correct state
  }, [setSearchBox]);

  const handleCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleSearch = async (event) => {
    if (window.innerWidth < 1024 && !search) {
      toggleSearchBox(); // First toggle the search box
      return;
    }
    if (!search) {
      alert('Please enter something to search');
      return;
    }

    try {
      if (category === 'all') {
        navigate(`/dash/search?text=${search}&name=${search}`);
      } else if (category === 'Posts') {
        navigate(`/dash/search?text=${search}`);
      } else if (category === 'people') {
        navigate(`/dash/search?name=${search}`);
      }
    } catch (error) {
      console.log(error);
    }

    setSearch(''); // Clear search after navigating
    toggleSearchBox(); // Close the search box
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const content = (
    <>
      <div
        className={`max-h-10 lg:pl-2 flex items-center mx-4 border-black/40 gap-2 lg:border rounded-l-md ${
          searchBox ? 'max-lg:search z-[500]' : 'min-h-full relative '
        }`}
      >
        {searchBox && (
          <div
            className="fixed inset-0 bg-[#000000cb] -z-1 lg:hidden"
            onClick={toggleSearchBox}
          />
        )}
        <div
          className={`lg:relative lg:flex lg:items-center ${
            searchBox
              ? `fixed max-lg:top-1/2 max-lg:-translate-y-1/2 max-lg:h-10 max-lg:flex max-lg:items-center max-lg:px-4 max-lg:max-w-[70%] max-lg:w-[30rem] max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:bg-zinc-200`
              : 'hidden'
          }`}
        >
          <h3 className="h3 text-zinc-100 absolute font-semibold bottom-full text-center w-full mb-4">
            Search
          </h3>
          <input
            type="text"
            onChange={handleInputChange}
            value={search}
            name="search"
            placeholder="Search user or post"
            className={`w-[20rem] max-sm:w-full outline-none bg-transparent border-r-2 border-black/50 z-[10] ${
              searchBox ? '' : 'max-lg:hidden'
            }`}
            onKeyDown={handleKeyDown}
          />
          <select
            name="category"
            className="max-w-max outline-none bg-transparent border-l border-none"
            onChange={handleCategory}
          >
            <option value="all" defaultChecked>
              All
            </option>
            <option value="people">People</option>
            <option value="Posts">Posts</option>
          </select>
          <img
            src={searchSvg}
            width={50}
            height={50}
            onClick={handleSearch}
            className={`absolute left-full min-w-10 max-w-10 border border-black/40 rounded-r-md aspect-1/1 bg-blue-500 p-2 ${
              searchBox && 'rounded-r-md'
            }`}
          />
        </div>
      </div>
    </>
  );

  return content;
};

export default Search;

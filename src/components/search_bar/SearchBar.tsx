import "./searchbar.scss";
import { BiSearchAlt2 } from "react-icons/bi";
import { useState, useEffect } from "react";

const categories = [
    "Burgers",
    "Pizzas",
    "Asado"
];

function SearchBar() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([])

  useEffect(() => {
    const results = categories.filter(cat => cat.toLowerCase().includes(search.toLowerCase()));
    setSearchResults(results);
  }, [search])

  const handleChange = (e:any) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container-search">
      <div className="input-icon-container">
        <BiSearchAlt2 className="icon-search" />
        <input className="input" type="text" placeholder="Search Category" value={search} onChange={handleChange}/>
      </div>

    </div>
  );
}

/*      <ul className="container-opcs">
        {searchResults.map(item => (<li className="opc-items">{item}</li>))}
      </ul>*/

export default SearchBar;

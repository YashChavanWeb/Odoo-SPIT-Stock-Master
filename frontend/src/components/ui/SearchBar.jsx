// src/components/ui/SearchBar.jsx

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg w-full max-w-md">
    <ion-icon name="search-outline" className="text-yellow-500 text-xl"></ion-icon>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-transparent outline-none text-white flex-1 placeholder:text-gray-400"
    />
  </div>
);

export default SearchBar;

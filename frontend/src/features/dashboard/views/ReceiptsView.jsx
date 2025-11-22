import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Button from '../../../components/ui/Button';
import TableView from '../components/TableView';
import KanbanView from '../components/KanbanView';
import SearchBar from '../../../components/ui/SearchBar';
import Tooltip from '@mui/material/Tooltip';
import ReceiptDetail from '../components/receipt/ReceiptDetail';
import CreateReceipt from '../components/receipt/CreateReceipt';

// NOTE: You'll need to create or import a Pagination component
// For simplicity, I'll use simple buttons here, but you should use a dedicated component.
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-center gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
    <Button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      variant="outlined"
    >
      Previous
    </Button>
    <span className="text-sm text-gray-700 dark:text-gray-300">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages}
      variant="outlined"
    >
      Next
    </Button>
  </div>
);


const API_BASE_URL = 'http://localhost:3000';
const PAGE_SIZE = 10; // Define a constant page size

const ReceiptsView = ({ onBack }) => {
  // Original states
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showCreateReceipt, setShowCreateReceipt] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Data Fetching and Pagination states
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // NEW: Current page number
  const [totalItems, setTotalItems] = useState(0); // NEW: Total count from API

  // Calculated total pages
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Function to fetch data from the backend
  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Include pagination parameters in the GET request
      // We'll also send the search term to let the API handle the filtering
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/receipts`, {
        params: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          search: search, // Pass search term to backend for efficient filtering
        },
      });

      // Assuming the API response structure is { data: [...receipts], totalCount: 42 }
      setReceipts(response.data.data || []);
      setTotalItems(response.data.totalCount || 0);

    } catch (err) {
      console.error("Error fetching receipts:", err);
      setError("Failed to load receipts. Please check the network and server status.");
      setReceipts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]); // Dependencies include currentPage and search

  // Effect to refetch data when page or search changes
  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // Handler for page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handler for search changes - reset page to 1 when search term changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter is now redundant for the main list since the API handles it, 
  // but we'll keep a simple filteredData variable for display consistency 
  // or if you still need local filtering on the small page chunk (though not recommended).
  // For this implementation, we will assume the API returns the correctly filtered/paginated list.
  const displayedData = receipts; // Use receipts directly as they are already paginated/filtered by API

  // --- Conditional Renders (Unchanged) ---
  if (selectedReceipt) {
    return (
      <ReceiptDetail
        receipt={selectedReceipt}
        onBack={() => setSelectedReceipt(null)}
        currentUser="Operator"
      />
    );
  }

  if (showCreateReceipt) {
    const handleSaveNewReceipt = async (newReceiptData) => {
      try {
        setLoading(true);
        // NOTE: Using POST on the base path, adjust if your API uses a different route/version
        await axios.post(`${API_BASE_URL}/api/v1/receipts`, newReceiptData);

        setShowCreateReceipt(false);
        setCurrentPage(1); // Go to first page to see the new item
        fetchReceipts(); // Refresh the list
      } catch (err) {
        console.error("Error creating receipt:", err);
        alert("Failed to create new receipt.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <CreateReceipt
        onBack={() => setShowCreateReceipt(false)}
        onSave={handleSaveNewReceipt}
      />
    );
  }

  // --- Main View Render ---
  return (
    <div className="space-y-6">
      {/* ... (Header Section - Remains mostly the same) ... */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          {/* Left Section - Back and New Buttons (Unchanged) */}
          <div className="flex items-center gap-3">
            <Tooltip title="Back to previous page" arrow>
              <Button
                variant="ghost"
                onClick={onBack}
                className="group hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <ion-icon name="arrow-back-outline" class="mr-2 text-gray-600 dark:text-gray-300 group-hover:text-yellow-600"></ion-icon>
                Back
              </Button>
            </Tooltip>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

            <Tooltip title="Create New Receipt" arrow>
              <Button
                onClick={() => setShowCreateReceipt(true)}
                variant="contained"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <ion-icon name="add-outline" class="mr-2"></ion-icon>
                New Receipt
              </Button>
            </Tooltip>
          </div>

          {/* Centered Title (Unchanged) */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Receipts
            </h1>
          </div>

          {/* Right Section - Search and View Toggles (Unchanged) */}
          <div className="flex items-center gap-2">
            {/* Search Toggle Button */}
            <Tooltip title={showSearch ? "Close search" : "Open search"} arrow>
              <Button
                variant="outlined"
                onClick={() => setShowSearch(!showSearch)}
                className="transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <ion-icon
                  name={showSearch ? "close-outline" : "search-outline"}
                  class="text-blue-600 dark:text-blue-400"
                ></ion-icon>
              </Button>
            </Tooltip>

            {/* View Mode Toggles (Unchanged) */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Tooltip title="List view" arrow>
                <Button
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'contained' : 'ghost'}
                  className={`min-w-10 h-10 transition-all duration-200 ${viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                >
                  <ion-icon
                    name="list-outline"
                    class={`text-lg ${viewMode === 'list'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                  ></ion-icon>
                </Button>
              </Tooltip>

              <Tooltip title="Kanban view" arrow>
                <Button
                  onClick={() => setViewMode('kanban')}
                  variant={viewMode === 'kanban' ? 'contained' : 'ghost'}
                  className={`min-w-10 h-10 transition-all duration-200 ${viewMode === 'kanban'
                    ? 'bg-white dark:bg-gray-600 shadow-sm'
                    : 'hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                >
                  <ion-icon
                    name="grid-outline"
                    class={`text-lg ${viewMode === 'kanban'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                  ></ion-icon>
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Collapsible Search Bar (Updated onChange handler) */}
        <div className={`transition-all duration-300 overflow-hidden ${showSearch ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <SearchBar
              value={search}
              onChange={handleSearchChange} // Use the new handler
              placeholder="Search receipts by reference, contact, location..."
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Content Section - Display Loading/Error/Data (Using displayedData) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[200px] flex flex-col justify-center items-center">
        {loading ? (
          <div className="flex flex-col items-center p-8">
            <ion-icon name="sync-outline" class="text-4xl text-yellow-500 animate-spin mb-3"></ion-icon>
            <p className="text-gray-600 dark:text-gray-400">Loading receipts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center p-8 text-red-600 dark:text-red-400">
            <ion-icon name="alert-circle-outline" class="text-4xl mb-3"></ion-icon>
            <p className="text-center font-medium">{error}</p>
            <Button
              onClick={fetchReceipts}
              variant="outlined"
              className="mt-4 border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Retry
            </Button>
          </div>
        ) : displayedData.length === 0 && search.length > 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <ion-icon name="sad-outline" class="text-4xl mb-3"></ion-icon>
            <p>No receipts found matching "{search}" on this page.</p>
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : displayedData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <ion-icon name="folder-open-outline" class="text-4xl mb-3"></ion-icon>
            <p>No receipts available. Click "New Receipt" to create one.</p>
          </div>
        ) : (
          viewMode === 'list'
            ? <TableView data={displayedData} onRowClick={(row) => setSelectedReceipt(row)} />
            : <KanbanView data={displayedData} onCardClick={(row) => setSelectedReceipt(row)} />
        )}

        {/* Pagination Controls */}
        {totalItems > PAGE_SIZE && !loading && !error && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Quick Stats Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 px-2">
        <span>Showing {displayedData.length} receipts on this page (Total: {totalItems})</span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <ion-icon name="close-circle-outline"></ion-icon>
            Clear search
          </button>
        )}
      </div>
    </div>
  );
};

export default ReceiptsView;
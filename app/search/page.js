"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Enhanced universal search with category filters and modal popup
 */

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTime, setSearchTime] = useState(0);
  const [availableTables, setAvailableTables] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const debounceRef = useRef(null);

  // Base tables configuration
  const baseTables = [
    {
      name: "Builder",
      displayName: "Builders",
      icon: "🏗️",
      color: "from-blue-500 to-blue-600",
      fieldsCandidates: [
        ['"Name"'],
        ['"Location"'],
        ['"About"'],
        ['"Experience"'],
        ['"Specialties"'],
        ['"License"']
      ],
      phoneField: '"Phone"',
      imageField: '"Image"'
    },
    {
      name: "Engineer",
      displayName: "Engineers",
      icon: "🔧",
      color: "from-purple-500 to-purple-600",
      fieldsCandidates: [
        ['"Name"'],
        ['"Location"'],
        ['"Qualification"'],
        ['"Specialization"'],
        ['"Experience"']
      ],
      phoneField: '"Phone"',
      imageField: 'image'
    },
    {
      name: "architecture",
      displayName: "Architecture",
      icon: "🏛️",
      color: "from-indigo-500 to-indigo-600",
      fieldsCandidates: [
        ["name"],
        ["location"],
        ["category"],
        ["style_description"],
        ["architect_name"]
      ],
      phoneField: null,
      imageField: "image_url"
    },
    {
      name: "contractors",
      displayName: "Contractors",
      icon: "👷‍♂️",
      color: "from-amber-500 to-amber-600",
      fieldsCandidates: [
        ["name"],
        ["location"],
        ["category"],
        ["experience"],
        ["bio"]
      ],
      phoneField: "phone",
      imageField: null
    },
    {
      name: "labours",
      displayName: "Labours",
      icon: "💪",
      color: "from-red-500 to-red-600",
      fieldsCandidates: [
        ["name"],
        ["location"],
        ["expertise"],
        ["stream"],
        ["experience"],
        ["about"]
      ],
      phoneField: "phone",
      imageField: "image_url"
    },
    {
      name: "labour", // Alternative table name
      displayName: "Labour",
      icon: "💪",
      color: "from-red-500 to-red-600",
      fieldsCandidates: [
        ["name"],
        ["location"],
        ["expertise"],
        ["stream"],
        ["experience"],
        ["about"]
      ],
      phoneField: "phone",
      imageField: "image_url"
    },
    {
      name: "shops",
      displayName: "Shops",
      icon: "🏪",
      color: "from-teal-500 to-teal-600",
      fieldsCandidates: [
        ["name"],
        ["owner_name"],
        ["address"],
        ["city"],
        ["state"],
        ["description"]
      ],
      phoneField: "phone",
      imageField: "logo_url"
    }
  ];

  // Detect available tables on component mount
  useEffect(() => {
    detectAvailableTables();
  }, []);

  // Function to detect which tables actually exist in the database
  async function detectAvailableTables() {
    const available = [];
    
    for (const table of baseTables) {
      try {
        const { data, error } = await supabase
          .from(table.name)
          .select('id')
          .limit(1);

        if (!error) {
          available.push(table);
        }
      } catch (error) {
        console.log(`❌ Error checking table ${table.name}:`, error.message);
      }
    }
    
    setAvailableTables(available);
  }

  // Function to load all data from a specific category
  async function loadCategoryData(category) {
    const startTime = performance.now();
    setLoading(true);
    setActiveCategory(category);
    setQuery("");

    try {
      const { data, error } = await supabase
        .from(category.name)
        .select("*")
        .limit(100);

      if (error) {
        console.error(`Error loading ${category.name}:`, error);
        setResults([]);
        return;
      }

      const formattedData = data.map(row => {
        let phone = null;
        if (category.phoneField) {
          phone = row[category.phoneField.replace(/"/g, '')] || 
                  row.phone || 
                  row.Phone || 
                  row.number;
        }

        const image = category.imageField ? 
          row[category.imageField.replace(/"/g, '')] : 
          row.image_url || 
          row.logo_url || 
          row.Image;

        return {
          ...row,
          source: category.name,
          sourceDisplay: category.displayName,
          sourceIcon: category.icon,
          sourceColor: category.color,
          __key: `${category.name}-${row.id}`,
          __phone: phone,
          __image: image
        };
      });

      const endTime = performance.now();
      setSearchTime(endTime - startTime);
      setResults(formattedData);
      
    } catch (error) {
      console.error(`Error loading category ${category.name}:`, error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Fuzzy search helper
  function getFuzzySearchTerms(searchText) {
    const terms = [searchText.toLowerCase()];
    
    const variations = {
      'engineer': ['enginer', 'engeneer', 'enginner', 'enginir'],
      'labour': ['labor', 'laber', 'labar'],
      'contractor': ['contracter', 'contrator'],
      'builder': ['bilder', 'buildr'],
      'architecture': ['architect', 'architec']
    };

    Object.keys(variations).forEach(key => {
      if (searchText.toLowerCase().includes(key)) {
        terms.push(...variations[key]);
      }
    });

    return [...new Set(terms)];
  }

  // Perform search
  async function performSearch(text) {
    const startTime = performance.now();
    const q = text.trim();
    if (!q) {
      setResults([]);
      setSearchTime(0);
      setActiveCategory(null);
      return;
    }

    setLoading(true);
    setActiveCategory(null);

    const found = new Map();
    const fuzzyTerms = getFuzzySearchTerms(q);
    const tablesToSearch = availableTables.length > 0 ? availableTables : baseTables;

    for (const tbl of tablesToSearch) {
      try {
        for (const fieldVariants of tbl.fieldsCandidates) {
          let gotData = null;
          
          for (const field of fieldVariants) {
            try {
              const exactQuery = `%${q}%`;
              let { data, error } = await supabase
                .from(tbl.name)
                .select("*")
                .ilike(field, exactQuery)
                .limit(50);

              if (error) continue;

              if (!data || data.length === 0) {
                for (const fuzzyTerm of fuzzyTerms) {
                  if (fuzzyTerm === q.toLowerCase()) continue;
                  
                  const fuzzyQuery = `%${fuzzyTerm}%`;
                  const { data: fuzzyData, error: fuzzyError } = await supabase
                    .from(tbl.name)
                    .select("*")
                    .ilike(field, fuzzyQuery)
                    .limit(50);

                  if (!fuzzyError && fuzzyData && fuzzyData.length) {
                    data = fuzzyData;
                    break;
                  }
                }
              }

              if (data && data.length) {
                gotData = data;
                break;
              }
            } catch (e) {
              continue;
            }
          }

          if (gotData && gotData.length) {
            for (const row of gotData) {
              const key = `${tbl.name}-${row.id}`;
              if (!found.has(key)) {
                let phone = null;
                if (tbl.phoneField) {
                  phone = row[tbl.phoneField.replace(/"/g, '')] || 
                          row.phone || 
                          row.Phone || 
                          row.number;
                }

                const image = tbl.imageField ? 
                  row[tbl.imageField.replace(/"/g, '')] : 
                  row.image_url || 
                  row.logo_url || 
                  row.Image;

                found.set(key, {
                  ...row,
                  source: tbl.name,
                  sourceDisplay: tbl.displayName,
                  sourceIcon: tbl.icon,
                  sourceColor: tbl.color,
                  __key: key,
                  __phone: phone,
                  __image: image
                });
              }
            }
          }
        }
      } catch (err) {
        continue;
      }
    }

    const endTime = performance.now();
    setSearchTime(endTime - startTime);
    const combined = Array.from(found.values()).sort((a, b) =>
      a.source.localeCompare(b.source)
    );
    setResults(combined);
    setLoading(false);
  }

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      if (!activeCategory) {
        setResults([]);
        setSearchTime(0);
      }
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, availableTables, activeCategory]);

  const onSearchSubmit = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    await performSearch(query);
  };

  // Open modal with item details
  const openModal = (item) => {
    setSelectedItem(item);
  };

  // Close modal
  const closeModal = () => {
    setSelectedItem(null);
  };

  // Clear active category
  const clearCategory = () => {
    setActiveCategory(null);
    setResults([]);
    setQuery("");
  };

  // Helper functions for display
  const displayName = (r) => {
    return r.Name || r.name || r.owner_name || "No name";
  };

  const displayLocation = (r) => {
    return r.Location || r.location || r.address || r.city || null;
  };

  const displayRating = (r) => {
    return r.Rating || r.rating || null;
  };

  const displayExperience = (r) => {
    return r.Experience || r.experience || null;
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Format field names for display
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/"/g, '')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🔍 Smart Construction Search
          </h1>
          <p className="text-gray-600 text-lg">
            {activeCategory ? `Showing all ${activeCategory.displayName}` : "Search or browse by category"}
          </p>
        </div>

        {/* Category Filters */}
        {availableTables.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Browse Categories</h2>
              {activeCategory && (
                <button
                  onClick={clearCategory}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to all categories
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {availableTables.map(table => (
                <button
                  key={table.name}
                  onClick={() => loadCategoryData(table)}
                  className={`inline-flex items-center px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeCategory?.name === table.name
                      ? `bg-gradient-to-r ${table.color} text-white shadow-lg scale-105`
                      : `bg-gray-100 text-gray-700 hover:shadow-md hover:scale-105`
                  }`}
                >
                  <span className="mr-2 text-lg">{table.icon}</span>
                  {table.displayName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Form */}
        {!activeCategory && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <form onSubmit={onSearchSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full border border-gray-200 p-4 rounded-xl text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 text-lg"
                  placeholder="Try 'enginer', 'labor', or any related term..."
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </form>

            {/* Search Stats */}
            {results.length > 0 && !activeCategory && (
              <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
                <span>Found {results.length} results</span>
                {searchTime > 0 && (
                  <span>in {searchTime.toFixed(0)}ms</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">
              {activeCategory ? `Loading ${activeCategory.displayName}...` : "Searching across categories..."}
            </span>
          </div>
        )}

        {/* Category Header */}
        {activeCategory && results.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 mb-6 text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${activeCategory.color} text-white text-xl font-bold mb-3`}>
              <span className="mr-3 text-2xl">{activeCategory.icon}</span>
              {activeCategory.displayName}
            </div>
            <p className="text-gray-600">
              Showing all {results.length} {activeCategory.displayName.toLowerCase()}
            </p>
          </div>
        )}

        {/* Results Grid */}
        {results.length === 0 && !loading && (query.trim() !== "" || activeCategory) && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {activeCategory ? `No ${activeCategory.displayName} found` : "No results found"}
            </h3>
            <p className="text-gray-500">
              {activeCategory 
                ? `There are no ${activeCategory.displayName.toLowerCase()} in the database yet.`
                : "Try different keywords or check your spelling"
              }
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((r) => {
            const uid = `${r.source}-${r.id}`;
            
            return (
              <div
                key={uid}
                onClick={() => openModal(r)}
                className="cursor-pointer border rounded-2xl p-5 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                {/* Header with Icon and Source */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${r.sourceColor} text-white text-sm font-semibold`}>
                    <span className="mr-2">{r.sourceIcon}</span>
                    {r.sourceDisplay}
                  </div>
                  {displayRating(r) && (
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                      ⭐ {displayRating(r)}
                    </div>
                  )}
                </div>

                {/* Image */}
                {r.__image && (
                  <img
                    src={r.__image}
                    alt={displayName(r)}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* Name and Location */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {displayName(r)}
                  </h3>
                  {displayLocation(r) && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <span className="mr-1">📍</span>
                      {displayLocation(r)}
                    </div>
                  )}
                </div>

                {/* Key Details */}
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  {displayExperience(r) && (
                    <div>💼 {displayExperience(r)}</div>
                  )}
                  {r.Specialization && (
                    <div>🎯 {r.Specialization}</div>
                  )}
                  {r.expertise && (
                    <div>🛠️ {r.expertise}</div>
                  )}
                  {r.Qualification && (
                    <div>📚 {r.Qualification}</div>
                  )}
                </div>

                {/* Short Description */}
                <div className="text-gray-600 text-sm mb-4">
                  {r.About ? (
                    <div className="line-clamp-3">{truncateText(r.About, 120)}</div>
                  ) : r.about ? (
                    <div className="line-clamp-3">{truncateText(r.about, 120)}</div>
                  ) : r.bio ? (
                    <div className="line-clamp-3">{truncateText(r.bio, 120)}</div>
                  ) : r.description ? (
                    <div className="line-clamp-3">{truncateText(r.description, 120)}</div>
                  ) : null}
                </div>

                {/* Click to View Indicator */}
                <div className="text-center text-blue-500 text-sm font-medium mt-2">
                  Click to view details {r.__phone && "& contact"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            {activeCategory ? (
              `Showing all ${results.length} ${activeCategory.displayName.toLowerCase()}`
            ) : (
              `Showing ${results.length} results from ${new Set(results.map(r => r.source)).size} categories`
            )}
          </div>
        )}
      </div>

      {/* Modal Popup */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${selectedItem.sourceColor} text-white text-sm font-semibold`}>
                    <span className="mr-2">{selectedItem.sourceIcon}</span>
                    {selectedItem.sourceDisplay}
                  </div>
                  {displayRating(selectedItem) && (
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                      ⭐ {displayRating(selectedItem)}
                    </div>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ×
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {displayName(selectedItem)}
              </h2>
              
              {displayLocation(selectedItem) && (
                <div className="flex items-center text-gray-600 mt-2">
                  <span className="mr-2">📍</span>
                  {displayLocation(selectedItem)}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              {selectedItem.__image && (
                <img
                  src={selectedItem.__image}
                  alt={displayName(selectedItem)}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {displayExperience(selectedItem) && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 font-semibold">Experience</div>
                    <div className="text-gray-800">{displayExperience(selectedItem)}</div>
                  </div>
                )}
                
                {selectedItem.Specialization && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-purple-600 font-semibold">Specialization</div>
                    <div className="text-gray-800">{selectedItem.Specialization}</div>
                  </div>
                )}
                
                {selectedItem.expertise && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 font-semibold">Expertise</div>
                    <div className="text-gray-800">{selectedItem.expertise}</div>
                  </div>
                )}
                
                {selectedItem.Qualification && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-orange-600 font-semibold">Qualification</div>
                    <div className="text-gray-800">{selectedItem.Qualification}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              {(selectedItem.About || selectedItem.about || selectedItem.bio || selectedItem.description) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedItem.About || selectedItem.about || selectedItem.bio || selectedItem.description}
                  </p>
                </div>
              )}

              {/* All Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Details</h3>
                <div className="space-y-3">
                  {Object.entries(selectedItem).map(([k, v]) => {
                    if (
                      k.startsWith('__') ||
                      k === 'source' ||
                      k === 'sourceDisplay' ||
                      k === 'sourceIcon' ||
                      k === 'sourceColor' ||
                      v === null ||
                      v === undefined ||
                      v === '' ||
                      k === 'Name' || k === 'name' ||
                      k === 'Location' || k === 'location' ||
                      k === 'About' || k === 'about' ||
                      k === 'Rating' || k === 'rating' ||
                      k === 'Experience' || k === 'experience' ||
                      k === 'Specialization' || k === 'expertise' ||
                      k === 'Qualification' || k === 'bio' || k === 'description'
                    ) return null;

                    const displayVal = typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v);
                    return (
                      <div key={k} className="flex justify-between items-start py-2 border-b border-gray-100">
                        <div className="capitalize text-gray-600 font-medium flex-shrink-0">
                          {formatFieldName(k)}:
                        </div>
                        <div className="text-right text-gray-800 ml-4 break-words flex-1">
                          {displayVal}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Actions */}
              <div className="sticky bottom-0 bg-white pt-4 border-t">
                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedItem.__phone ? (
                    <a
                      href={`tel:${selectedItem.__phone}`}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      📞 Call {selectedItem.__phone}
                    </a>
                  ) : (
                    <div className="flex-1 text-center text-gray-500 py-4 border-2 border-dashed border-gray-300 rounded-xl">
                      No phone number available
                    </div>
                  )}
                  
                  {(selectedItem.Email || selectedItem.email) && (
                    <a
                      href={`mailto:${selectedItem.Email || selectedItem.email}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      ✉️ Send Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
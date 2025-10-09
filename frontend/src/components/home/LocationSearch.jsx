import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

// Popular cities in India (you can expand this list)
const popularCities = [
  { id: 1, name: 'Mumbai', state: 'Maharashtra' },
  { id: 2, name: 'Delhi', state: 'Delhi' },
  { id: 3, name: 'Bangalore', state: 'Karnataka' },
  { id: 4, name: 'Hyderabad', state: 'Telangana' },
  { id: 5, name: 'Chennai', state: 'Tamil Nadu' },
  { id: 6, name: 'Kolkata', state: 'West Bengal' },
  { id: 7, name: 'Pune', state: 'Maharashtra' },
  { id: 8, name: 'Ahmedabad', state: 'Gujarat' },
  { id: 9, name: 'Jaipur', state: 'Rajasthan' },
  { id: 10, name: 'Surat', state: 'Gujarat' },
  { id: 11, name: 'Lucknow', state: 'Uttar Pradesh' },
  { id: 12, name: 'Kanpur', state: 'Uttar Pradesh' },
  { id: 13, name: 'Nagpur', state: 'Maharashtra' },
  { id: 14, name: 'Indore', state: 'Madhya Pradesh' },
  { id: 15, name: 'Thane', state: 'Maharashtra' },
  { id: 16, name: 'Bhopal', state: 'Madhya Pradesh' },
  { id: 17, name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { id: 18, name: 'Patna', state: 'Bihar' },
  { id: 19, name: 'Vadodara', state: 'Gujarat' },
  { id: 20, name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { id: 21, name: 'Ludhiana', state: 'Punjab' },
  { id: 22, name: 'Agra', state: 'Uttar Pradesh' },
  { id: 23, name: 'Nashik', state: 'Maharashtra' },
  { id: 24, name: 'Faridabad', state: 'Haryana' },
  { id: 25, name: 'Meerut', state: 'Uttar Pradesh' },
  { id: 26, name: 'Rajkot', state: 'Gujarat' },
  { id: 27, name: 'Kalyan-Dombivali', state: 'Maharashtra' },
  { id: 28, name: 'Vasai-Virar', state: 'Maharashtra' },
  { id: 29, name: 'Varanasi', state: 'Uttar Pradesh' },
  { id: 30, name: 'Srinagar', state: 'Jammu and Kashmir' },
  { id: 31, name: 'Aurangabad', state: 'Maharashtra' },
  { id: 32, name: 'Dhanbad', state: 'Jharkhand' },
  { id: 33, name: 'Amritsar', state: 'Punjab' },
  { id: 34, name: 'Navi Mumbai', state: 'Maharashtra' },
  { id: 35, name: 'Allahabad', state: 'Uttar Pradesh' },
  { id: 36, name: 'Ranchi', state: 'Jharkhand' },
  { id: 37, name: 'Howrah', state: 'West Bengal' },
  { id: 38, name: 'Coimbatore', state: 'Tamil Nadu' },
  { id: 39, name: 'Jabalpur', state: 'Madhya Pradesh' },
  { id: 40, name: 'Gwalior', state: 'Madhya Pradesh' },
];

const LocationSearch = ({ onClose }) => {
  const { location, setLocation } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(popularCities.slice(0, 8));
  const [isDetecting, setIsDetecting] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities(popularCities.slice(0, 8));
    } else {
      const filtered = popularCities.filter(
        (city) =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          city.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 10));
    }
  }, [searchTerm]);

  const handleCitySelect = (city) => {
    setLocation(city.name);
    setSearchTerm('');
    setIsOpen(false);
    onClose?.();
  };

  const handleClearLocation = () => {
    setLocation('');
    setSearchTerm('');
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In a real app, you would use reverse geocoding API here
        // For now, we'll just set a default city
        setLocation('Current Location');
        setIsDetecting(false);
        setIsOpen(false);
        onClose?.();
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to detect your location. Please select manually.');
        setIsDetecting(false);
      }
    );
  };

  // If onClose is provided, render as inline dropdown (for Navbar)
  if (onClose) {
    return (
      <>
        {/* Search Input */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search for your city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Detect Current Location */}
        <button
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition text-left border-b border-gray-100"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Navigation size={18} className={`text-blue-600 ${isDetecting ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {isDetecting ? 'Detecting...' : 'Use Current Location'}
            </div>
            <div className="text-xs text-gray-500">Auto-detect your location</div>
          </div>
        </button>

        {/* Popular Cities */}
        <div className="p-2 max-h-80 overflow-y-auto">
          {filteredCities.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {searchTerm ? 'Search Results' : 'Popular Cities'}
              </div>
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition text-left group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <MapPin size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{city.name}</div>
                    <div className="text-xs text-gray-500">{city.state}</div>
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
              <div className="text-sm text-gray-500">No cities found</div>
              <div className="text-xs text-gray-400 mt-1">Try a different search term</div>
            </div>
          )}
        </div>

        {/* Quick Cities */}
        {!searchTerm && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Quick Select
            </div>
            <div className="flex flex-wrap gap-2">
              {popularCities.slice(0, 6).map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // Default standalone mode (for Hero section)
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Location Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl transition-all text-white text-sm font-medium shadow-lg hover:shadow-xl"
      >
        <MapPin size={18} />
        <span className="hidden sm:inline">
          {location || 'Select Location'}
        </span>
        <span className="sm:hidden">
          {location ? location.split(',')[0] : 'Location'}
        </span>
        {location && (
          <X
            size={16}
            onClick={(e) => {
              e.stopPropagation();
              handleClearLocation();
            }}
            className="hover:text-red-300 transition"
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up z-50">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search for your city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Detect Current Location */}
          <button
            onClick={detectCurrentLocation}
            disabled={isDetecting}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition text-left border-b border-gray-100"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Navigation size={18} className={`text-blue-600 ${isDetecting ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {isDetecting ? 'Detecting...' : 'Use Current Location'}
              </div>
              <div className="text-xs text-gray-500">Auto-detect your location</div>
            </div>
          </button>

          {/* Popular Cities */}
          <div className="p-2 max-h-80 overflow-y-auto">
            {filteredCities.length > 0 ? (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {searchTerm ? 'Search Results' : 'Popular Cities'}
                </div>
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 rounded-lg transition text-left group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <MapPin size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{city.name}</div>
                      <div className="text-xs text-gray-500">{city.state}</div>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                <div className="text-sm text-gray-500">No cities found</div>
                <div className="text-xs text-gray-400 mt-1">Try a different search term</div>
              </div>
            )}
          </div>

          {/* Quick Cities */}
          {!searchTerm && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Quick Select
              </div>
              <div className="flex flex-wrap gap-2">
                {popularCities.slice(0, 6).map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;



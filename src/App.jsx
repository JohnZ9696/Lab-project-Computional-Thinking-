import { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const redMarkerIcon = new L.Icon({
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function App() {
  const [location, setLocation] = useState('');
  const [mapCenter, setMapCenter] = useState([16.0544, 108.2022]);
  const [mapZoom, setMapZoom] = useState(13);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPoiId, setSelectedPoiId] = useState(null);
  const [weather, setWeather] = useState(null);
  const [lastSearchParams, setLastSearchParams] = useState(null);
  const mapRef = useRef(null);

  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'your_api_key_here';

  const highlightedCities = ['Hà Nội', 'Đà Nẵng', 'Hội An', 'Huế', 'Sài Gòn'];

  const fetchWeather = async (lat, lon, locationName) => {
    try {
      const weatherResponse = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat: lat,
            lon: lon,
            appid: OPENWEATHER_API_KEY,
            units: 'metric',
            lang: 'vi'
          }
        }
      );
      
      const capitalizeLocationName = (name) => {
        return name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };
      
      setWeather({
        temp: Math.round(weatherResponse.data.main.temp),
        feelsLike: Math.round(weatherResponse.data.main.feels_like),
        humidity: weatherResponse.data.main.humidity,
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon,
        windSpeed: weatherResponse.data.wind.speed,
        locationName: capitalizeLocationName(locationName)
      });
    } catch (weatherError) {
      console.error('Weather API error:', weatherError);
      setWeather(null);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setError('Vui lòng nhập tên địa điểm');
      return;
    }

    setLoading(true);
    setError('');
    setPointsOfInterest([]);
    setSelectedPoiId(null);
    setWeather(null);

    try {
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: `${query}, Vietnam`,
            format: 'json',
            limit: 1,
            addressdetails: 1
          },
          headers: {
            'User-Agent': 'POI-Finder-Vietnam-App'
          }
        }
      );

      if (geocodeResponse.data.length === 0) {
        setError('Không tìm thấy địa điểm. Vui lòng thử lại với tên khác.');
        setLoading(false);
        return;
      }

      const mainLocation = geocodeResponse.data[0];
      const { lat, lon, address } = mainLocation;
      
      // Kiểm tra xem có phải địa điểm ở Việt Nam không
      const country = address?.country || mainLocation.display_name;
      if (!country.toLowerCase().includes('vietnam') && 
          !country.toLowerCase().includes('việt nam') && 
          !country.toLowerCase().includes('viet nam')) {
        setError('Chỉ tìm kiếm địa điểm trong Việt Nam. Vui lòng thử lại.');
        setLoading(false);
        return;
      }
      
      const isProvince = (address?.state || address?.historic) && 
                        (mainLocation.type === 'administrative' || 
                         mainLocation.type === 'historic' ||
                         mainLocation.class === 'boundary' ||
                         !address?.city);
      
      const provinceName = address?.state || address?.historic || address?.province || address?.county;
      console.log(`Searching in province: ${provinceName}, isProvince: ${isProvince}`);
      
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
      setMapZoom(14);

      let searchRadius = isProvince ? 0.15 : 0.05;
      let poiResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: 'tourism|attraction|museum|restaurant|hotel|temple|pagoda|church|market|beach|park',
            format: 'json',
            limit: 50,
            bounded: 1,
            viewbox: `${parseFloat(lon) - searchRadius},${parseFloat(lat) - searchRadius},${parseFloat(lon) + searchRadius},${parseFloat(lat) + searchRadius}`,
            addressdetails: 1
          },
          headers: {
            'User-Agent': 'POI-Finder-Vietnam-App'
          }
        }
      );

      let uniquePOIs = [];
      let seenNames = new Set();
      
      for (const poi of poiResponse.data) {
        if (uniquePOIs.length >= 5) break;
        
        const name = poi.display_name.split(',')[0];
        const poiProvince = poi.address?.state || poi.address?.historic || poi.address?.province || poi.address?.county;
        
        const isValidProvince = !isProvince || !provinceName || poiProvince === provinceName;
        
        if (!seenNames.has(name) && poi.lat && poi.lon && isValidProvince) {
          seenNames.add(name);
          uniquePOIs.push({
            id: poi.place_id,
            name: name,
            fullName: poi.display_name,
            lat: parseFloat(poi.lat),
            lon: parseFloat(poi.lon),
            type: poi.type || 'attraction'
          });
        } else if (isProvince && !isValidProvince) {
          console.log(`Skipping ${name} (in ${poiProvince}, not in ${provinceName})`);
        }
      }

      if (uniquePOIs.length < 5) {
        console.log('Expanding search to sub-locations...');
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const subLocationsResponse = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
              params: {
                q: `${query}, Vietnam`,
                format: 'json',
                limit: 10,
                addressdetails: 1
              },
              headers: {
                'User-Agent': 'POI-Finder-Vietnam-App'
              }
            }
          );

          console.log(`Found ${subLocationsResponse.data.length} sub-locations`);

          for (const subLoc of subLocationsResponse.data) {
            if (uniquePOIs.length >= 5) break;
            
            if (subLoc.place_id === mainLocation.place_id) continue;
            
            const subLat = parseFloat(subLoc.lat);
            const subLon = parseFloat(subLoc.lon);
            
            console.log(`Searching near ${subLoc.display_name.split(',')[0]}...`);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const subPoiResponse = await axios.get(
              `https://nominatim.openstreetmap.org/search`,
              {
              params: {
                q: 'tourism|attraction|museum|restaurant|hotel|temple|pagoda|church|market|beach|park',
                format: 'json',
                limit: 30,
                bounded: 1,
                viewbox: `${subLon - 0.03},${subLat - 0.03},${subLon + 0.03},${subLat + 0.03}`,
                addressdetails: 1
              },
              headers: {
                'User-Agent': 'POI-Finder-Vietnam-App'
              }
            }
          );

          console.log(`Found ${subPoiResponse.data.length} POIs in this area`);

          for (const poi of subPoiResponse.data) {
            if (uniquePOIs.length >= 5) break;
            
            const name = poi.display_name.split(',')[0];
            const poiProvince = poi.address?.state || poi.address?.historic || poi.address?.province || poi.address?.county;
            
            const isValidProvince = !isProvince || !provinceName || poiProvince === provinceName;
            
            if (!seenNames.has(name) && poi.lat && poi.lon && isValidProvince) {
              seenNames.add(name);
              uniquePOIs.push({
                id: poi.place_id,
                name: name,
                fullName: poi.display_name,
                lat: parseFloat(poi.lat),
                lon: parseFloat(poi.lon),
                type: poi.type || 'attraction'
              });
            } else if (!isValidProvince) {
              console.log(`Skipping ${name} from sub-location (in ${poiProvince}, not in ${provinceName})`);
            }
          }
        }
      } catch (subError) {
        console.error('Sub-location search error:', subError);
      }
    }
    
      if (uniquePOIs.length < 5) {
        console.log('Trying Overpass API...');
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const searchRadius = isProvince ? 20000 : 5000;
          const overpassQuery = `
            [out:json][timeout:25];
            (
              node["tourism"](around:${searchRadius},${lat},${lon});
              node["amenity"="restaurant"](around:${searchRadius},${lat},${lon});
              node["amenity"="cafe"](around:${searchRadius},${lat},${lon});
              node["historic"](around:${searchRadius},${lat},${lon});
              node["leisure"](around:${searchRadius},${lat},${lon});
              way["tourism"](around:${searchRadius},${lat},${lon});
            );
            out center 20;
          `;
          
          const overpassResponse = await axios.post(
            'https://overpass-api.de/api/interpreter',
            overpassQuery,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
          );

          if (overpassResponse.data.elements) {
            console.log(`Overpass found ${overpassResponse.data.elements.length} elements`);
            for (const element of overpassResponse.data.elements) {
              if (uniquePOIs.length >= 5) break;
              
              const name = element.tags?.name || element.tags?.tourism || element.tags?.amenity || 'Unnamed';
              const elementLat = element.lat || element.center?.lat;
              const elementLon = element.lon || element.center?.lon;
              
              if (name !== 'Unnamed' && !seenNames.has(name) && elementLat && elementLon) {
                seenNames.add(name);
                uniquePOIs.push({
                  id: element.id,
                  name: name,
                  fullName: name,
                  lat: parseFloat(elementLat),
                  lon: parseFloat(elementLon),
                  type: element.tags?.tourism || element.tags?.amenity || 'attraction'
                });
              }
            }
          }
        } catch (overpassError) {
          console.error('Overpass API error:', overpassError);
        }
      }

      console.log(`Total POIs found: ${uniquePOIs.length}`);

      if (uniquePOIs.length === 0) {
        setError('Không tìm thấy điểm tham quan trong khu vực này. Vui lòng thử tỉnh/thành phố khác.');
        setPointsOfInterest([]);
        setWeather(null);
        setLastSearchParams(null);
      } else {
        setPointsOfInterest(uniquePOIs);
        setSelectedPoiId(uniquePOIs[0]?.id || null);
        
        setLastSearchParams({
          query,
          mainLocation,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          isProvince,
          provinceName,
          searchRadius,
          seenNames: Array.from(seenNames)
        });
        
        if (uniquePOIs.length < 5) {
          setError(`Tìm thấy ${uniquePOIs.length} điểm tham quan trong khu vực này.`);
        }
        fetchWeather(parseFloat(lat), parseFloat(lon), query);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (e) => {
    e.preventDefault();
    performSearch(location);
  };

  const handleSuggestionClick = (city) => {
    setLocation(city);
    performSearch(city);
  };

  const loadMorePOIs = async () => {
    if (!lastSearchParams) return;
    
    setLoading(true);
    try {
      const { lat, lon, isProvince, provinceName, seenNames: existingNames } = lastSearchParams;
      const seenNames = new Set(existingNames);
      const newPOIs = [];
      
      const expandedRadius = isProvince ? 0.25 : 0.1;
      
      const morePoiResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: 'tourism|attraction|museum|restaurant|hotel|temple|pagoda|church|market|beach|park|cafe',
            format: 'json',
            limit: 100,
            bounded: 1,
            viewbox: `${lon - expandedRadius},${lat - expandedRadius},${lon + expandedRadius},${lat + expandedRadius}`,
            addressdetails: 1
          },
          headers: {
            'User-Agent': 'POI-Finder-Vietnam-App'
          }
        }
      );

      for (const poi of morePoiResponse.data) {
        if (newPOIs.length >= 5) break;
        
        const name = poi.display_name.split(',')[0];
        const poiProvince = poi.address?.state || poi.address?.province || poi.address?.county;
        const isValidProvince = !isProvince || !provinceName || poiProvince === provinceName;
        
        if (!seenNames.has(name) && poi.lat && poi.lon && isValidProvince) {
          seenNames.add(name);
          newPOIs.push({
            id: poi.place_id,
            name: name,
            fullName: poi.display_name,
            lat: parseFloat(poi.lat),
            lon: parseFloat(poi.lon),
            type: poi.type || 'attraction'
          });
        }
      }

      if (newPOIs.length > 0) {
        const updatedPOIs = [...pointsOfInterest, ...newPOIs];
        setPointsOfInterest(updatedPOIs);
        setLastSearchParams({
          ...lastSearchParams,
          seenNames: Array.from(seenNames)
        });
        setError(`Đã thêm ${newPOIs.length} điểm tham quan mới. Tổng: ${updatedPOIs.length} địa điểm.`);
      } else {
        setError('Không tìm thấy thêm điểm tham quan nào trong khu vực này.');
      }
    } catch (err) {
      console.error('Error loading more POIs:', err);
      setError('Đã xảy ra lỗi khi tải thêm địa điểm.');
    } finally {
      setLoading(false);
    }
  };

  const handlePoiClick = (poi) => {
    setSelectedPoiId(poi.id);
    const newCenter = [poi.lat, poi.lon];
    setMapCenter(newCenter);
    setMapZoom(17);
    
    if (mapRef.current) {
      mapRef.current.flyTo(newCenter, 17, {
        duration: 1.2
      });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="hero-label">Khám phá Việt Nam</div>
          <h1>Tìm Điểm Tham Quan Việt Nam</h1>
          <p className="hero-subtitle">
            Nhập tên thành phố hoặc tỉnh thành, hệ thống sẽ gợi ý những điểm check-in nổi bật gần bạn.
          </p>
          <form onSubmit={searchLocation} className="search-form">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Nhập tên địa điểm (ví dụ: Hà Nội, Đà Nẵng, Hội An...)"
              className="search-input"
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Đang tìm kiếm...' : 'Tìm kiếm'}
            </button>
          </form>

          <div className="quick-tags" aria-label="Đề xuất nhanh">
            {highlightedCities.map((city) => (
              <button
                key={city}
                type="button"
                className="quick-tag"
                onClick={() => handleSuggestionClick(city)}
                disabled={loading}
              >
                {city}
              </button>
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}
          
          {weather && (
            <div className="weather-card">
              <div className="weather-location-name">{weather.locationName}</div>
              <div className="weather-header">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="weather-icon"
                />
                <div className="weather-temp">
                  <span className="temp-value">{weather.temp}°C</span>
                  <span className="weather-desc">{weather.description}</span>
                </div>
              </div>
              <div className="weather-details">
                <div className="weather-item">
                  <span className="weather-label">Cảm giác:</span>
                  <span className="weather-value">{weather.feelsLike}°C</span>
                </div>
                <div className="weather-item">
                  <span className="weather-label">Độ ẩm:</span>
                  <span className="weather-value">{weather.humidity}%</span>
                </div>
                <div className="weather-item">
                  <span className="weather-label">Gió:</span>
                  <span className="weather-value">{weather.windSpeed} m/s</span>
                </div>
              </div>
            </div>
          )}
          
          {pointsOfInterest.length > 0 && (
            <div className="poi-count">
              Đã tìm thấy {pointsOfInterest.length} điểm tham quan
            </div>
          )}
        </div>
        <div className="header-ornament" aria-hidden="true" />
      </header>

      <main className="layout">
        <section className="sidebar">
          <div className="sidebar-header">
            <h2>Danh sách điểm tham quan</h2>
            <span className="sidebar-count">{pointsOfInterest.length}</span>
          </div>
          {pointsOfInterest.length === 0 ? (
            <p className="empty-state">Nhập tên địa điểm để bắt đầu khám phá.</p>
          ) : (
            <ul className="poi-list">
              {pointsOfInterest.map((poi, index) => {
                const isSelected = selectedPoiId === poi.id;
                return (
                  <li 
                    key={poi.id} 
                    className={`poi-list-item${isSelected ? ' active' : ''}`}
                    onClick={() => handlePoiClick(poi)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="poi-number">{index + 1}</span>
                    <div className="poi-details">
                      <strong>{poi.name}</strong>
                      <div className="poi-type">{poi.type}</div>
                      <div className="poi-coordinates">
                        {poi.lat.toFixed(3)}, {poi.lon.toFixed(3)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="map-panel">
          {loading && (
            <div className="loading-overlay">
              <span className="loader" aria-live="polite" />
              <p>Đang tải dữ liệu địa điểm...</p>
            </div>
          )}
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            key={`${mapCenter[0]}-${mapCenter[1]}-${pointsOfInterest.length}`}
            className="map-view"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pointsOfInterest.map((poi) => (
              <Marker key={poi.id} position={[poi.lat, poi.lon]}>
                <Popup>
                  <div className="popup-content">
                    <strong>{poi.name}</strong>
                    <small>{poi.type}</small>
                    <small className="coordinates">
                      {poi.lat.toFixed(4)}, {poi.lon.toFixed(4)}
                    </small>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </section>
      </main>
    </div>
  );
}

export default App;

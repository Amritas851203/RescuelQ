import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useSosStore from '../store/useSosStore';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords, map]);
  return null;
};

const LiveMap = () => {
  const reports = useSosStore((state) => state.reports);
  const [center, setCenter] = useState([19.0760, 72.8777]); // Mumbai

  return (
    <div className="h-full relative glass-panel overflow-hidden border-0">
      <MapContainer center={center} zoom={12} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {reports.map((report) => (
          <div key={report.id}>
            <Marker position={[report.location.lat, report.location.lng]}>
              <Popup>
                <div className="text-slate-900 p-1">
                  <h4 className="font-bold border-b border-slate-200 mb-1">{report.severity} Alert</h4>
                  <p className="text-xs mb-1">{report.summary}</p>
                  <p className="text-[10px] text-slate-500">From: {report.caller_phone}</p>
                </div>
              </Popup>
            </Marker>
            <Circle 
              center={[report.location.lat, report.location.lng]} 
              radius={500} 
              pathOptions={{ 
                color: report.severity === 'Critical' ? '#ef4444' : '#f59e0b',
                fillColor: report.severity === 'Critical' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.1
              }} 
            />
          </div>
        ))}
        
        <RecenterMap coords={center} />
      </MapContainer>

      <div className="absolute top-4 right-4 z-10 space-y-2">
        <div className="glass-panel p-3 text-xs space-y-2 w-48">
          <h4 className="font-bold uppercase tracking-wider text-slate-400">Map Legend</h4>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-critical"></span>
            <span>Critical Emergency</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-warning"></span>
            <span>Injured / Stranded</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-safe"></span>
            <span>Safe / Shelter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;

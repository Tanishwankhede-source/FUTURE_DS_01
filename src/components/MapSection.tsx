import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import type { StateData } from '../types/data';
import { Map as MapIcon } from 'lucide-react';

// Pre-defined coordinates for US States
const stateCoordinates: Record<string, [number, number]> = {
  "Alabama": [32.806671, -86.791130], "Alaska": [61.370716, -152.404419], "Arizona": [33.729759, -111.431221], 
  "Arkansas": [34.969704, -92.373123], "California": [36.116203, -119.681564], "Colorado": [39.059811, -105.311104], 
  "Connecticut": [41.597782, -72.755371], "Delaware": [39.318523, -75.507141], "District of Columbia": [38.897438, -77.026817],
  "Florida": [27.766279, -81.686783], "Georgia": [33.040619, -83.643074], "Hawaii": [21.094318, -157.498337], 
  "Idaho": [44.240459, -114.478828], "Illinois": [40.349457, -88.986137], "Indiana": [39.849426, -86.258278], 
  "Iowa": [42.011539, -93.210526], "Kansas": [38.526600, -96.726486], "Kentucky": [37.668140, -84.670067], 
  "Louisiana": [31.169546, -91.867805], "Maine": [44.693947, -69.381927], "Maryland": [39.063946, -76.802101], 
  "Massachusetts": [42.230171, -71.530106], "Michigan": [43.326618, -84.536095], "Minnesota": [45.694454, -93.900192], 
  "Mississippi": [32.741646, -89.678696], "Missouri": [38.456085, -92.288368], "Montana": [46.921925, -110.454353], 
  "Nebraska": [41.125370, -98.268082], "Nevada": [38.313515, -117.055374], "New Hampshire": [43.452492, -71.563896], 
  "New Jersey": [40.298904, -74.521011], "New Mexico": [34.840515, -106.248482], "New York": [42.165726, -74.948051], 
  "North Carolina": [35.630066, -79.806419], "North Dakota": [47.528912, -99.784012], "Ohio": [40.388783, -82.764915], 
  "Oklahoma": [35.565342, -96.928917], "Oregon": [44.572021, -122.070938], "Pennsylvania": [40.590752, -77.209755], 
  "Rhode Island": [41.680893, -71.511780], "South Carolina": [33.856892, -80.945007], "South Dakota": [44.299782, -99.438828], 
  "Tennessee": [35.747845, -86.692345], "Texas": [31.054487, -97.563461], "Utah": [40.150032, -111.862434], 
  "Vermont": [44.045876, -72.710686], "Virginia": [37.769337, -78.169968], "Washington": [47.400902, -121.490494], 
  "West Virginia": [38.491226, -80.954453], "Wisconsin": [44.268543, -89.616508], "Wyoming": [42.755966, -107.302490]
};

interface MapSectionProps {
  data: StateData[];
}

const MapUpdater = ({ data }: { data: StateData[] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([39.8283, -98.5795], 4);
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [data, map]);

  return null;
};

// Wrapper components to bypass strict TypeScript on react-leaflet v4 props
const AnyMapContainer = MapContainer as any;
const AnyTileLayer = TileLayer as any;
const AnyCircleMarker = CircleMarker as any;
const AnyTooltip = Tooltip as any;

const MapSection: React.FC<MapSectionProps> = ({ data }) => {
  const maxSales = Math.max(...data.map(d => d.sales), 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
      className="glass-panel p-6 rounded-2xl col-span-1 lg:col-span-2 relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity group-hover:bg-blue-500/10 pointer-events-none z-0" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
          <MapIcon className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Geographic Performance</h2>
          <p className="text-sm text-slate-400 mt-0.5">Sales distribution and profit margin by State</p>
        </div>
      </div>

      <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-700/50 relative z-10 bg-slate-900/50">
        <AnyMapContainer 
          center={[39.8283, -98.5795] as LatLngExpression}
          zoom={4} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', background: '#0a0f1c' }}
          className="z-0"
        >
          <AnyTileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater data={data} />
          
          {data.map((stateInfo) => {
            const coords = stateCoordinates[stateInfo.state];
            if (!coords) return null;
            
            const normalizedSize = Math.max((stateInfo.sales / maxSales) * 35, 5);
            const color = stateInfo.profit >= 0 ? '#3b82f6' : '#f43f5e';
            const fillColor = stateInfo.profit >= 0 ? '#60a5fa' : '#fb7185';

            return (
              <AnyCircleMarker
                key={stateInfo.state}
                center={coords as LatLngExpression}
                radius={normalizedSize}
                pathOptions={{ 
                  color: color, 
                  fillColor: fillColor, 
                  fillOpacity: 0.6,
                  weight: 2
                }}
              >
                <AnyTooltip 
                  direction="top" 
                  offset={[0, -10]} 
                  opacity={1} 
                  className="bg-slate-900 border-slate-700 text-slate-200"
                >
                  <div className="p-1 font-sans">
                    <p className="font-bold text-base border-b border-slate-600 pb-1 mb-1">{stateInfo.state}</p>
                    <p className="text-sm">
                      <span className="text-slate-400">Sales: </span>
                      <span className="font-semibold text-white">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stateInfo.sales)}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-slate-400">Profit: </span>
                      <span className={`font-semibold ${stateInfo.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(stateInfo.profit)}
                      </span>
                    </p>
                  </div>
                </AnyTooltip>
              </AnyCircleMarker>
            );
          })}
        </AnyMapContainer>
      </div>
    </motion.div>
  );
};

export default MapSection;

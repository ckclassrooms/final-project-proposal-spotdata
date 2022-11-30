import mapboxgl from 'mapbox-gl';


const mapboxPublicKey = import.meta.env.VITE_APP_MAPBOX_PUBLIC_TOKEN;

mapboxgl.accessToken = mapboxPublicKey;

export const mapboxClient = mapboxgl;
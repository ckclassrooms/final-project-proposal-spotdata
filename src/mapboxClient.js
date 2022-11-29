import mapboxgl from 'mapbox-gl';


const mapboxPublicKey = import.meta.env.VITE_APP_MAPBOX_PUBLIC_TOKEN;
console.log('MAPBOX PUBLIC KEY CLIENT SIDE : ', mapboxPublicKey);

mapboxgl.accessToken = mapboxPublicKey;

export const mapboxClient = mapboxgl;
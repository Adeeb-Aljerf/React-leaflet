import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "./Button";
import styles from "./Map.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../context/CityProvider";
import { useGeolocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
export default function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: getLocationPosition,
    getPosition,
    error,
  } = useGeolocation();

  const [mapLat, mapLng] = useUrlPosition();

  // an effect that updates the map position when the user clicks on a city so the map is centered on the city even
  // after the user navigates away from the city info page
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (getLocationPosition)
        setMapPosition([getLocationPosition.lat, getLocationPosition.lng]);
    },
    [getLocationPosition]
  );

  return (
    // to change in any third lib you have to make a new component and use it on the 3d lib commo ( map component )
    <div className={styles.mapContainer}>
      {!getLocationPosition && (
        <>
          <Button type={"position"} onClick={getPosition}>
            {isLoadingPosition ? "Loading..." : "go to your position"}
          </Button>
          {error && <div className={styles.error}>{error}</div>}
        </>
      )}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={7}
        minZoom={3}
        scrollWheelZoom={true}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition}></ChangeCenter>
        <DetectClick></DetectClick>
      </MapContainer>
    </div>
  );
}

// a custom component that takes the current position and sets it as the center of the map
function ChangeCenter({ position }) {
  // build in hook from leaflet to take the current position
  const map = useMap();
  map.setView(position);
  return null;
}

// a custom component that open a forms when the user click someWehere on the map
function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
      console.log(e);
    },
  });
}

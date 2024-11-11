import { useEffect, useState } from "react";

export function useGeolocation(defaultValue = null) {
  const [position, setPosition] = useState(defaultValue);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        // console.log(position.lat);
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }
  return { position, error, isLoading, getPosition };
}

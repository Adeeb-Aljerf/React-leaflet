import { useState } from "react";

export function useGeolocation(defaultValue = null) {
  const [position, setPosition] = useState(defaultValue);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function getPosition() {
    if (!navigator.geolocation)
      return setError("Your browser does not support geolocation");

    setIsLoading(true);

    // Add high accuracy option to force GPS usage
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        setIsLoading(false);
      },
      (error) => {
        // Handle specific GPS-related errors
        if (error.code === error.POSITION_UNAVAILABLE) {
          setError("Please enable GPS location services");
        } else if (error.code === error.TIMEOUT) {
          setError(
            "Location request timed out. Please check if GPS is enabled"
          );
        } else {
          setError(error.message);
        }
        setIsLoading(false);
      },
      options
    );
  }

  return { position, error, isLoading, getPosition };
}

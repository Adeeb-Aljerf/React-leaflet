import { useState } from "react";

export function useGeolocation(defaultValue = null) {
  const [position, setPosition] = useState(defaultValue);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getPosition() {
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    try {
      // First check for permissions
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        return setError(
          "Please enable location permissions in your browser settings"
        );
      }

      setIsLoading(true);

      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // Increased timeout
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
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("Location permission denied");
              break;
            case error.POSITION_UNAVAILABLE:
              setError(
                "Location information unavailable. Please check your GPS settings"
              );
              break;
            case error.TIMEOUT:
              setError("Location request timed out. Please try again");
              break;
            default:
              setError("An unknown error occurred");
          }
          setIsLoading(false);
        },
        options
      );
    } catch (err) {
      setError("Failed to access location services");
      setIsLoading(false);
    }
  }

  return { position, error, isLoading, getPosition };
}

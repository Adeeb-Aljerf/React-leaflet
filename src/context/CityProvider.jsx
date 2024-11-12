import { createContext, useContext, useEffect, useReducer } from "react";

const CityContext = createContext();
const BASE_URL = "https://adeeb-aljerf.github.io/City-api/cities.json";

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };

    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
      };

    case "city/selected":
      return { ...state, currentCity: action.payload, isLoading: false };

    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "rejected":
      return { ...state, setIsLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CityProvider({ children }) {
  const initalState = {
    cities: [],
    isLoading: false,
    currentCity: {},
  };

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initalState
  );

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: "loading" });
      // Only fetch if localStorage is empty
      if (!localStorage.getItem("cities")) {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        localStorage.setItem("cities", JSON.stringify(data));
      }
      // Load data from localStorage
      const data = JSON.parse(localStorage.getItem("cities"));
      dispatch({ type: "cities/loaded", payload: data });
    };

    loadInitialData();
  }, []); // This will run only once when component mounts

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const data = JSON.parse(localStorage.getItem("cities") || "[]");
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });
      const city = cities.find((city) => city.id === id);
      dispatch({ type: "city/selected", payload: city });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data city",
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const currentCities = JSON.parse(localStorage.getItem("cities") || "[]");
      const cityWithId = { ...newCity, id: crypto.randomUUID() };
      const updatedCities = [...currentCities, cityWithId];
      localStorage.setItem("cities", JSON.stringify(updatedCities));
      dispatch({ type: "city/created", payload: cityWithId });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating city",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      const currentCities = JSON.parse(localStorage.getItem("cities") || "[]");
      const updatedCities = currentCities.filter((city) => city.id !== id);
      localStorage.setItem("cities", JSON.stringify(updatedCities));
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city",
      });
    }
  }

  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        error,
        deleteCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

function useCities() {
  const context = useContext(CityContext);
  if (context === undefined)
    throw new Error("CityContext was used outside of the CityProvider");
  return context;
}

export { CityProvider, useCities };

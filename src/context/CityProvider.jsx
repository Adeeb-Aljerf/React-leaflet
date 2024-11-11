import { act, createContext, useContext, useEffect, useReducer } from "react";

const CityContext = createContext();
// const BASE_URL = "http://localhost:9000";
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
  // const [cities, setCities] = useState([]);
  // const [currentCity, setCurrentCity] = useState({});
  // const [isLoading, setIsLoading] = useState(false);

  const initalState = {
    cities: [],
    isLoading: false,
    currentCity: {},
  };

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initalState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });

        const res = await fetch(`${BASE_URL}/cities`);
        // const res = await fetch(`${BASE_URL}`);
        const data = await res.json();

        if (data) dispatch({ type: "cities/loaded", payload: data });
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

      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/selected", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data city",
      });
    }
  }
  async function createCity(currentCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(currentCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      //? we are adding the new city to the cities array
      // setCities((cities) => [...cities, data]);

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading city",
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      //? Update the state after successful deletion
      // setCities((cities) => cities.filter((city) => city.id !== id));

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading city",
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

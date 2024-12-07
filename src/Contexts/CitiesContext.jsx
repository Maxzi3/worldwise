import { createContext, useContext, useEffect, useReducer } from "react";

const URL = "http://localhost:8000";

export const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        cities: action.payload,
        isLoading: false,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown Action Type");
  }
};

export const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchcities = async () => {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${URL}/cities`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch city: ${res.status} ${res.statusText}`
          );
        }
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: error.message });
      }
    };
    fetchcities();
  }, []);

  const getCity = async (id) => {
    if (Number(id) == currentCity.id) return;
    dispatch({ type: "loading" }); // Start loading
    try {
      const res = await fetch(`${URL}/cities/${id}`);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch city: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data }); // Update state with city data
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  };
  const createCity = async (newcity) => {
    dispatch({ type: "loading" }); // Start loading
    try {
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newcity),
      });
      if (!res.ok) {
        throw new Error(
          `Failed to fetch city: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  };
  const deleteCity = async (id) => {
    dispatch({ type: "loading" }); // Start loading
    try {
      await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  };

  const contextValue = {
    cities,
    isLoading,
    currentCity,
    getCity,
    createCity,
    deleteCity,
    error,
  };
  return (
    <CitiesContext.Provider value={contextValue}>
      {children}
    </CitiesContext.Provider>
  );
};
export const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("CitiesContext was used outside the CitiesProvider");
  }
  return context;
};

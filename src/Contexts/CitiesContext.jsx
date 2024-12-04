import { createContext, useContext, useEffect, useState } from "react";

const URL = "http://localhost:8000";

export const CitiesContext = createContext();

export const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState([]);

  useEffect(() => {
    const fetchcities = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${URL}/cities`);
        if (!res.ok) {
          throw new Error(
            `Failed to fetch city: ${res.status} ${res.statusText}`
          );
        }
        const data = await res.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching city:", error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchcities();
  }, []);

  const getCity = async (id) => {
    setIsLoading(true); // Start loading
    try {
      const res = await fetch(`${URL}/cities/${id}`);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch city: ${res.status} ${res.statusText}`
        );
      }
      const data = await res.json();
      setCurrentCity(data); // Update state with city data
    } catch (error) {
      console.error("Error fetching city:", error);
      alert(error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const contextValue = {
    cities,
    isLoading,
    currentCity,
    getCity,
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

// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useCities } from "../Contexts/citiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [lat, lng] = useUrlPosition();
  const [emoji, setEmoji] = useState("");
  const [geoerror, setGeoError] = useState("");
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(() => {
    if (!lat && !lng) return;
    const fetchCityData = async () => {
      setIsLoadingGeocoding(true);
      setGeoError("");
      try {
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        const data = await response.json();
        if (!data.countryCode)
          throw new Error("That doesn't look like a city click somewhere else");
        setCityName(data.city || data.locality || "");
        setCountry(data.country);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        console.error(error);
        setGeoError(error.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    };
    fetchCityData();
  }, [lat, lng]);
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!cityName || !country) return;
  //   const newCity = {
  //     name: cityName,
  //     country,
  //     date,
  //     notes,
  //     };
  //     await createCity(newCity);
  //     setCityName("");
  //     setCountry("");
  //     setDate(new Date());
  //     setNotes("");
  //     };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: { lat, lng },
    };

    await   createCity(newCity);
    navigate('/app/cities')
  };

  if (!lat && !lng)
    return <Message message="Start by Clicking somewhere on the map" />;
  if (isLoadingGeocoding) return <Spinner />;
  if (geoerror) return <Message message={geoerror} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button onclick={handleSubmit} type="primary">
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;

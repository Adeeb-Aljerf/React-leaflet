import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../context/CityProvider";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({ city }) {
  const { cityName, date, emoji, id, position } = city;
  const { currentCity, deleteCity } = useCities();

  const handleDelete = function (e) {
    e.preventDefault();
    //? this well delete the city from the list but not from the api
    // const newCities = cities.filter((city) => city.id !== id);
    // setCities(newCities);

    deleteCity(id);
  };
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        {/* <time className={styles.date}>({formatDate(date)})</time> */}
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

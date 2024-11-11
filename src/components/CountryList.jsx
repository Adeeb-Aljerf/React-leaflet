import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../context/CityProvider";

export default function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner></Spinner>;
  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on the map"></Message>
    );

  const countries = [];

  //  const countries = cities.reduce((arr, city) => {
  //   if (!arr.map((el) => el.country).includes(city.country))
  //     arr.push({ country: city.country, emoji: city.emoji });
  //   return arr;
  // }, []);
  cities.forEach((city) => {
    if (!countries.map((el) => el.country).includes(city.country))
      countries.push({ country: city.country, emoji: city.emoji });
  });

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import PublicNavbar from "./components/PublicNavbar";
import { Col, Container, Row } from "react-bootstrap";
import SideMenu from "./components/SideMenu";
import WeatherInfo from "./components/WeatherInfo";
// import { ClipLoader } from "react-spinners";
import { cities } from "./config";

const API_KEY = "24ee19012620ceecb014d7640b1874a9";

// <ClipLoader color="#f86c6b" size={150} loading={true} />

const App = () => {
  const [geoLocation, setGeoLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [apiError, setAPIError] = useState("");
  const url = getURL(geoLocation.latitude, geoLocation.longitude);

  function getURL(latitude, longitude) {
    console.log("getURL", selectedCity, latitude, setLoading);
    if (selectedCity)
      return `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity.latitude}&lon=${selectedCity.longitude}&appid=${API_KEY}`;
    if (!latitude || !longitude) return "";
    return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  }

  useEffect(() => {
    setLoading(true);

    const onPosition = (position) => {
      setGeoLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
      setLoading(false);
    };
    const onError = (error) => {
      setGeoLocation({ position: null, error: error });
      setLoading(false);
    };
    navigator.geolocation.getCurrentPosition(onPosition, onError);
    const listener = navigator.geolocation.watchPosition(onPosition, onError);
    return () => navigator.geolocation.clearWatch(listener);
  }, []);

  useEffect(() => {
    console.log("Loading weather");
    if (!url) return;
    const getWeather = async (url) => {
      setLoading(true);
      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        setWeather(data);
      } catch (err) {
        console.log(err);
        setAPIError(err.message);
      }
      setLoading(false);
    };
    getWeather(url);
  }, [url]);

  const handleCityChange = (city) => {
    if (city === "current") {
      setSelectedCity(null);
    } else {
      console.log("selected city", city);
      setSelectedCity(city);
    }
  };

  return (
    <>
      <PublicNavbar />
      <Container fluid>
        <Row>
          <Col md={3} className="d-none d-md-block">
            <SideMenu
              cities={cities}
              handleCityChange={handleCityChange}
              selectedCity={selectedCity}
            />
          </Col>
          <Col md={9}>
            {loading ? (
              <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
                {/* <ClipLoader color="#f86c6b" size={150} loading={true} /> */}
                loading
              </div>
            ) : !apiError ? (
              <WeatherInfo weather={weather} />
            ) : (
              apiError
            )}

            {/* <br /><br /><br />
            {geoLocation.loading
              ? "Loading.."
              : geoLocation.latitude
              ? `Latitude: ${geoLocation.latitude} Longitude: ${geoLocation.longitude}`
              : ""} */}
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default App;
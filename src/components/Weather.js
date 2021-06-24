import React, { useEffect, useState } from 'react';
import ReactBootstrap, { Container, Col, Row, Alert, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CityInput from './CityInput';
import CityList from './CityList';

const IP_ADDRESS_LOCATION_ENDPOINT = 'http://ip-api.com/json/';
const WEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_API_KEY = '99b84d8baf9a2dbccdcf348d52979b99';
const WEATHER_STORAGE_KEY = 'weatherApp.Storage';
const UNITS = 'metric';


export default function Weather() {

    const notify = (msg) => toast.dark(msg);

    const [cities, setCities] = useState([]);

    
    const [showCurrentButton, setShowCurrentButton] = useState(false);


    // Should come up with a way to periodically update the data.
    // Best way I think would be to set an interval and update every 
    // X minutes, etc.
    useEffect(() => {
        // Disable the get current location button if
        // geolocation isn't possible in device / browser
        if (navigator.geolocation) {
            setShowCurrentButton(true)
        }
        
        let citiesData = JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY + ".Cities"));
        if (citiesData) setCities(citiesData);
        
    }, [])

    useEffect(() => {
        localStorage.setItem(WEATHER_STORAGE_KEY + ".Cities", JSON.stringify(cities));
    }, [cities])

    // async function fetchWeather(url) {
    //     return fetch(url)
    //         .then(res => res.json())
    //         .then(result => {
    //             return result;
    //         });
    // }


    async function get(url) {
        return fetch(url).then(res => res.json());
    }

    async function getCityWeather(city = null) {
        let url = `${WEATHER_ENDPOINT}`;
        if (city !== null && `${city}`.length !== 0) {
            // Retrieve weather data based on city:
            url += `?q=${city}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
            return get(url).then(data => {
                if (data.cod !== 200) {
                    notify(data.message);
                    return false;
                } else {
                    setCities(prevCities => {
                        return [...prevCities, data];
                    });
                    notify('City added to your list');
                    return true;
                }
            })
            
        } else {
            notify("No city name provided!");
            return false;
        }
    }

    async function getWeather(e) {
        let url = `${WEATHER_ENDPOINT}`;

        if (navigator.geolocation) {
            // Geolocation is possible with this device,
            // attempt to get location:
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // Success! Now call the weather api:
                    notify("Success, now call the weather api!")
                    url += `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
                    return get(url);
                },
                function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                    // we are now going to estimate their location based on IP-API free look up
                    // this isn't accurate but it works:
                    return get(IP_ADDRESS_LOCATION_ENDPOINT)
                        .then((result) => {
                            console.log("this one");
                            url += `?lat=${result.lat}&lon=${result.lon}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
                            return get(url);
                        });
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 0
                }
            );
        } else {
            // Geolocation isn't possible on this device:
            return get(IP_ADDRESS_LOCATION_ENDPOINT)
                .then((result) => {
                    url += `?lat=${result.lat}&lon=${result.lon}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
                    return get(url);
                });
        }
    }

    return (
        <>
            <ToastContainer />
            <Container>
                <Row>
                    <Col>
                        <CityInput onSubmitCity={(v) => getCityWeather(v)} />
                        {showCurrentButton === true &&
                            <Button variant="primary" onClick={getWeather}>Get Weather</Button>
                        }
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <CityList cities={cities} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

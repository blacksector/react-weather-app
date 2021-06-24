import React, { useEffect, useState } from 'react';
import ReactBootstrap, { Container, Col, Row, Alert, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Fab, Action } from 'react-tiny-fab';
import 'react-toastify/dist/ReactToastify.css';

import CityInput from './CityInput';
import CityList from './CityList';

const IP_ADDRESS_LOCATION_ENDPOINT = 'https://ipapi.co/json/';
const WEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_API_KEY = '99b84d8baf9a2dbccdcf348d52979b99';
const WEATHER_STORAGE_KEY = 'weatherApp.Storage';
const UNITS = 'metric';


export default function Weather() {

    const [cities, setCities] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const notify = (msg) => toast.dark(msg);

    // Should come up with a way to periodically update the data.
    // Best way I think would be to set an interval and update every 
    // X minutes, etc.
    useEffect(() => {
        // Get cities in storage and save to state
        let citiesData = JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY + ".Cities"));
        if (citiesData) {
            setCities(citiesData);
        }
        // Get last updated and then refresh if data is older than 5 minutes
        let lastUpdated = JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY + '.LastUpdated'));
        if (lastUpdated && (new Date() - lastUpdated) >= 300*1000 && citiesData.length !== 0) {
            refreshAll(this, citiesData);
        }
        
    }, [])

    useEffect(() => {
        localStorage.setItem(WEATHER_STORAGE_KEY + ".Cities", JSON.stringify(cities));
        // Last updated:
        localStorage.setItem(WEATHER_STORAGE_KEY + '.LastUpdated', JSON.stringify(new Date().getTime()));
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

    function isCityInList(city) {
        if (cities.filter(c => city === c.name).length !== 0) {
            notify('Seems like you already have this city in your list');
            return true;
        }
        return false;
    }

    async function refreshAll(ev, data = false) {
        // Get all the cities and seperately store their id's and 
        // fetch all of them:
        let updatedCities = [];
        let citiesData = data === false ? cities : data;
        console.log(citiesData);
        for (let city of citiesData) {
            let temp = await get(`${WEATHER_ENDPOINT}?id=${city.id}&units=${UNITS}&appid=${WEATHER_API_KEY}`).then(data => data);
            updatedCities.push(temp);
        }
        setCities(updatedCities);
        notify("Updated weather data.");
    }

    function deleteAll() {
        const deleteCities = () => { notify("Cities removed."); setCities([]); }
        toast.dark(
        <>
            Click "DELETE" to remove the list of cities.
            <Button variant="link" onClick={deleteCities}>DELETE</Button>
        </>);
    }

    async function getCityWeather(city = null) {
        let url = `${WEATHER_ENDPOINT}`;
        // search if the city exists first:
        if (isCityInList(city)) return;
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
                    handleClose();
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
                    url += `?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
                    return get(url).then(data => {
                        if (data.cod !== 200) {
                            notify(data.message);
                            return false;
                        } else {
                            if (isCityInList(data.name)) return;
                            setCities(prevCities => {
                                return [...prevCities, data];
                            });
                            handleClose();
                            notify('City added to your list');
                            return true;
                        }
                    });
                },
                function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                    // we are now going to estimate their location based on IP-API free look up
                    // this isn't accurate but it works:
                    return get(IP_ADDRESS_LOCATION_ENDPOINT)
                        .then((result) => {
                            url += `?lat=${result.latitude}&lon=${result.longitude}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
                            return get(url).then(data => {
                                if (data.cod !== 200) {
                                    notify(data.message);
                                    return false;
                                } else {
                                    if (isCityInList(data.name)) return;
                                    setCities(prevCities => {
                                        return [...prevCities, data];
                                    });
                                    handleClose();
                                    notify('City added to your list');
                                    return true;
                                }
                            });
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
                    url += `?lat=${result.latitude}&lon=${result.longitude}&units=${UNITS}&appid=${WEATHER_API_KEY}`;
                    return get(url).then(data => {
                        if (data.cod !== 200) {
                            notify(data.message);
                            return false;
                        } else {
                            if (isCityInList(data.name)) return;
                            setCities(prevCities => {
                                return [...prevCities, data];
                            });
                            handleClose();
                            notify('City added to your list');
                            return true;
                        }
                    });
                });
        }
    }

    return (
        <>
            <ToastContainer />

            <CityList cities={cities} />

            <Fab alwaysShowTitle={true} icon="&#9881;">
                <Action text="Delete All" onClick={deleteAll}>
                    <i className="fa fa-trash" />
                </Action>
                <Action text="Refresh" onClick={refreshAll}>
                    <i className="fa fa-sync" />
                </Action>
                <Action text="Add City" onClick={handleShow}>
                    <i className="fa fa-plus" />
                </Action>
            </Fab>

            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add City</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CityInput onSubmitCity={(v) => getCityWeather(v)} onGetCurrentLocation={(v) => getWeather(v)}/>
                </Modal.Body>
            </Modal>

        </>
    )
}

import React from 'react'
import ReactBootstrap, { Accordion } from 'react-bootstrap';

import City from './City';

export default function CityList({cities}) {
    return (
        <>
            <p class="display-4">Your Cities</p>
            <Accordion defaultActiveKey={cities[0]?.id}>
                {cities.map(city => {
                    return <City key={city.id} city={city} />
                })}
            </Accordion>
        </>
    )
}

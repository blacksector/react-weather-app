import React from 'react'
import ReactBootstrap, { Accordion } from 'react-bootstrap';

import City from './City';

export default function CityList({cities}) {
    return (
        <>
            <Accordion defaultActiveKey={cities[0]?.id}>
                {cities.map(city => {
                    return <City key={city.id} city={city} />
                })}
            </Accordion>
        </>
    )
}

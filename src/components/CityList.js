import React from 'react'
import ReactBootstrap, { Accordion } from 'react-bootstrap';

import City from './City';

export default function CityList({cities}) {
    let citiesExist = cities.length === 0 ? false : true;
    return (
        <>
            { !citiesExist && 
                <>
                    <div style={{
                        display: 'flex',
                        height: '85vh',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <p class="lead text-center">Please add a city first!</p>
                    </div>
                    
                </>
            }
            <Accordion defaultActiveKey={cities[0]?.id}>
                {cities.map(city => {
                    return <City key={city.id} city={city} />
                })}
            </Accordion>
        </>
    )
}

import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({city, latlng}) => {
    const [data, setData] = useState(null)
    const lat = latlng[0]
    const lon = latlng[1]
    const api_key = import.meta.env.VITE_SOME_KEY

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
            .then(response => {
                setData(response.data)
            })
    },[lat,lon,api_key])

    if(data === null) return null

    return (
        <div>
            <h2>Weather in {city}</h2>
            <div>temperature {data.main.temp} Celsius</div>
            <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt=''/>
            <div>wind {data.wind.speed} m/s</div>
        </div>
    )
}

export default Weather

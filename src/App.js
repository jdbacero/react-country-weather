import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const [country, setCountry] = useState()

  const handleFilter = (e) => setFilter(e.target.value)
  const showCountries = filter.length === 0 ? countries : countries.filter(value => {
    return value.name.official.toLowerCase().includes(filter.toLowerCase())
  })

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        setCountries(response.data)
        console.log(response.data)
      })
  }, [])

  useEffect(() => setCountry(showCountries[0]), [showCountries.length === 1])

  return (
    <div>
      Find countries
      <input type="text" onChange={handleFilter} value={filter} />

      <div>
        <Countries showCountries={showCountries} setCountry={setCountry} />
      </div>

      <Country country={country} />

    </div>
  )
}

const Countries = ({ showCountries, setCountry }) => {
  const length = showCountries.length
  const showCountry = (country) => {
    return () => {
      setCountry(country)
    }
  }

  if (length > 10) {
    return "Too many matches, specify another filter."
  } else if (length > 1 && length < 10) {
    return (
      <ul>
        {showCountries.map(el =>
          <li key={el.altSpellings[0]}>{el.name.official} <button onClick={showCountry(el)}>Show</button> </li>
        )}
      </ul>
    )
  }
  else if (length === 0) {
    return "No matches."
  }
}

const Country = ({ country }) => {
  if (country) {

    return (
      <div>
        <h1>{country.name.official}</h1>
        <p>Capital: {country.capital[0]}</p>
        <p>Area: {country.area}</p>
        <h3>Languages:</h3>
        <ul>
          {
            Object.keys(country.languages)
              .map(key => <li key={key}>{country.languages[key]}</li>)
          }
        </ul>
        <img src={country.flags.svg} width="200px" alt={`${country.name.official}'s Flag`} />

        <h3>Weather in {country.capital[0]}</h3>
        <Weather latlng={country.latlng} />

      </div>
    )
  }
}

const Weather = ({ latlng }) => {
  const [weather, setWeather] = useState({ temp: '', icon: '', wind: '' })
  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${process.env.REACT_APP_API_KEY}`)
      .then(response => {
        console.log(response.data)
        setWeather({ wind: `${response.data.wind.speed} m/s`, icon: response.data.weather[0].icon, temp: response.data.main.temp - 273.15 })
      })
  }, [latlng])

  return (
    <div>
      <p>
        Temperature: {weather.temp} Celsius
      </p>
      <img src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
      <p>Wind {weather.wind} </p>
    </div>
  )

}

export default App;

import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({country}) => (
  <>
    <h1>{country.name.common}</h1>
    <div>capital {country.capital}</div>
    <div>area {country.area}</div>
    <h3>languages:</h3>
    <div><ul>{Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}</ul></div>
    <img src={country.flags.png}/>
  </>
)

const FilterFeedback = ({countries}) => {
  const length = countries.length

  if(length > 10) return <div>Too many matches, specify another filter</div>
  if(length > 1 && length <= 10) return <>{countries.map(country => <div key={country.tld}>{country.name.common}</div>)}</>
  if(length === 1) return <Country country={countries[0]} />
}
function App() {
  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState('')

  
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  },[])

  if(countries === null) return null   

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      find countries <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <FilterFeedback countries={filteredCountries} />
    </>
  )
}

export default App

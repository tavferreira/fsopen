import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Countries from './components/Countries'
import Country from './components/Country'

function App() {
  const [data, setData] = useState(null)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState(null)
  const setSearchOnly = (e) => {
    setSearch(e)
     setCountry(null)
  }
  const selectCountry = (country) => {
    setCountry(country)
    setSearch('')
  }

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setData(response.data)
      })
  },[])

  if(data === null) return null   

  const isEmptySearch = search === ''
  const filteredCountries = data.filter(country => country.name.common.toLowerCase().includes(search.toLowerCase()))
  
  const numberOfResults = filteredCountries.length
  const tooManyResults = numberOfResults > 10
  const reasonableAmountOfResults = numberOfResults > 1 && numberOfResults <= 10
  const justOneResult = numberOfResults === 1

  return (
    <>
      <Filter search={search} setSearch={setSearchOnly}/>
      {!isEmptySearch && tooManyResults && <div>Too many matches, specify another filter</div>}
      {!isEmptySearch && reasonableAmountOfResults && <Countries countries={filteredCountries} setCountry={selectCountry} />}
      {!isEmptySearch && justOneResult && <Country country={filteredCountries[0]} />}
      {isEmptySearch && country && <Country country={country} />}
    </>
  )
}

export default App

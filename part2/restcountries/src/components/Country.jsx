import Weather from './Weather'

const Country = ({country}) => (
    <>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <div><ul>{Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}</ul></div>
      <img src={country.flags.png}/>
      <Weather city={country.capital} latlng={country.latlng} />
    </>
  )

export default Country

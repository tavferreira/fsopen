const Countries = ({countries, setCountry: selectCountry}) => (
    <>
      {countries.map(country => (
          <div key={country.name.common}>
            {country.name.common}<button onClick={() => selectCountry(country)}>show</button>
          </div>
        )
      )}
    </>
  )

export default Countries

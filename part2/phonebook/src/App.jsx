import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const personExists = (name) => persons.some(person => person.name === name)

  const sendToServer = (person) => axios.
                                    post('http://localhost:3001/persons',person)
                                    .then(response => {
                                      setPersons(persons.concat(response.data))
                                      setNewName('')
                                      setNewNumber('')
                                    })

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {name: newName, number: newNumber}
    personExists(newName) ? alert(`${newName} is already added to phonebook`): sendToServer(newPerson)  
  }

  const handlePersonChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)
  
  const filterPersons = (person) => person.name.toLowerCase().includes(filter.toLowerCase())
  const personsToShow = filter ? persons.filter(filterPersons) : persons

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
        <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handlePersonChange} numberValue={newNumber} numberOnChange={handleNumberChange}/>
      <h3>Numbers</h3>
        <Persons persons={personsToShow} />
    </div>
  )
}

export default App

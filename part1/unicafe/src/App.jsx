import { useState } from 'react'

const Header = props => <h1>{props.text}</h1>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistic = (props) => (
  <div>{props.name} {props.value}</div>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad

  const average = () => {
    return ((good*1) + (neutral*0) + (bad*-1)) / total 
  }

  const positivePercentage = () => {

    if(total === 0) return 0

    return (good/total)*100
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good+1)} text="good" />
      <Button handleClick={() => setNeutral(neutral+1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistic name="good" value={good} />
      <Statistic name="neutral" value={neutral} />
      <Statistic name="bad" value={bad} />
      <Statistic name="average" value={average()} />
      <Statistic name="positive" value={`${positivePercentage()} %`} />
    </div>
  )
}

export default App

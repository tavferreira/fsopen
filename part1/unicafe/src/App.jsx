import { useState } from 'react'

const Header = props => <h1>{props.text}</h1>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = ({good, neutral, bad, total}) => {
  const average = () => {
    return total !== 0 ? ((good*1) + (neutral*0) + (bad*-1)) / total : 0
  }

  const positivePercentage = () => {
    if(total === 0) return 0

    return (good/total)*100
  }
  return (
  <>  
    <div>good {good}</div>
    <div>neutral {neutral}</div>
    <div>bad {bad}</div>
    <div>average {average()}</div>
    <div>positive {positivePercentage()} %</div>
  </>
)}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setGood(good+1)} text="good" />
      <Button handleClick={() => setNeutral(neutral+1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      {total > 0 ? <Statistics good={good} neutral={neutral} bad={bad} total={total} /> : <p>No feedback given</p>}
    </div>
  )
}

export default App

const Header = ({ course }) => <h1>{course}</h1>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part => <Part key={part.id} part={part} />)}     
  </>

const Total = ({ sum }) => <p><strong>Number of exercises {sum}</strong></p>

const Course = ({course}) => {
  const initialValue = 0;
  const total = course.parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises
  ,initialValue)
  
  return <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total sum={total} />
  </>
}

export default Course

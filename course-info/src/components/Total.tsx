import React from 'react';

interface TotalProps {
  name: string;
  exerciseCount: number;
}

const Total = ({courses}: {courses: Array<TotalProps>}) => {
  return (
    <p>
      Number of exercises{" "}
      {courses.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

export default Total;
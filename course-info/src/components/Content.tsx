import React from 'react';

interface ContentProps {
  name: string;
  exerciseCount: number;
}

const Content = ({courses}: {courses: Array<ContentProps>}) => {
  return (
    <div>
      {courses.map((course, index) =>
        <p key={index}>{course.name} {course.exerciseCount}</p>
      )}
    </div>
  );
};

export default Content;

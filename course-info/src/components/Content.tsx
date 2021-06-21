import React from 'react';
import Part from './Part';
import { CoursePart } from '../App';

const Content = ({courses}: {courses: Array<CoursePart>}) => {
  return (
    <div>
      {courses.map((course, index) =>
        <Part course={course} key={index} />
      )}
    </div>
  );
};

export default Content;

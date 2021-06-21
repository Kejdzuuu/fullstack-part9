import React from 'react';
import { CoursePart } from '../App';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({course}: {course: CoursePart}) => {
  switch (course.type) {
    case "normal":
      return (
        <div>
          <h3>{course.name} {course.exerciseCount}</h3>
          {course.description}<br />
        </div>
      );
    case "groupProject":
      return (
        <div>
          <h3>{course.name} {course.exerciseCount}</h3>
          project exercises {course.groupProjectCount}<br />
        </div>
      );
    case "submission":
      return (
        <div>
          <h3>{course.name} {course.exerciseCount}</h3>
          {course.description}<br />
          submit to <a href='#'>{course.exerciseSubmissionLink}</a><br />
        </div>
      );
    case "special":
      return (
        <div>
          <h3>{course.name} {course.exerciseCount}</h3>
          {course.description}<br />
          required skills: {" "}
          {course.requirements.join(', ')}
        </div>
      );
    default:
      return assertNever(course);
  }
};

export default Part;

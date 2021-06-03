import { parseArguments } from './argumentParser';

interface ExerciseResult {
  numOfDays: number;
  numOfTrainingDays: number;
  target: number;
  averageTime: number;
  targetReached: boolean;
  rating: number;
  ratingDescription: string;
} 

export const calculateExercise = (dailyExercise: Array<number>, target: number): ExerciseResult => {
  let hoursSum = 0;
  let trainingDays = 0;

  for (const hours of dailyExercise) {
    hoursSum += hours;
    if (hours !== 0) {
      trainingDays++;
    }
  }

  const averageHours: number = hoursSum / dailyExercise.length;
  let rating = 0;
  let ratingDescription = '';
  let targetReached = false;

  if (averageHours/target >= 1) {
    rating = 3;
    ratingDescription = "Good job! Target reached.";
    targetReached = true;
  } else if (averageHours/target > 0.5) {
    rating = 2;
    ratingDescription = "Almost there, but not quite.";
  } else {
    rating = 1;
    ratingDescription = "You have to try harder.";
  }

  return {
    numOfDays: dailyExercise.length,
    numOfTrainingDays: trainingDays,
    target: target,
    averageTime: averageHours,
    targetReached: targetReached,
    rating: rating,
    ratingDescription: ratingDescription
  };
};

try {
  const args = parseArguments(process.argv.slice(2));
  console.log(calculateExercise(args.slice(1), args[0]));
} catch (e) {
  if (e instanceof Error) {
    console.log('Error: ', e.message);
  }
}

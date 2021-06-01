import { parseArguments } from './argumentParser'

export const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0) {
    return 'Height must be bigger than zero';
  }

  height = height / 100;
  const bmi = weight / (height * height);

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal (healthy weight)";
  } else if (bmi < 30) { 
    return "Overweight";
  } else {
    return "Obese";
  }
}

try {
  const args = parseArguments(process.argv.slice(2));
  console.log(calculateBmi(args[0], args[1]));
} catch (e) {
  console.log('Error: ', e.message);
}

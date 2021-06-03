import express from 'express';
import { parseArguments } from './argumentParser';
import { calculateBmi } from './bmiCalculator';
import { calculateExercise } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  try {
    const args: Array<string> = [req.query.height as string, req.query.weight as string];
    const parsedArgs = parseArguments(args);
    const response = {
      weight: parsedArgs[1],
      height: parsedArgs[0],
      bmi: calculateBmi(parsedArgs[0], parsedArgs[1])
    };
    res.status(200).send(response);
  } catch (e) {
    res.status(404).json({
      error: 'malformatted parameters'
    });
  }
});

app.post('/exercises', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = req.body;
    const args: Array<string> = body.daily_exercises.concat(body.target);
    const parsedArgs = parseArguments(args);
    const response = calculateExercise(parsedArgs.slice(0, -1), parsedArgs.slice(-1)[0]);
    res.status(201).json(response);
  } catch (e) {
    res.status(404).json({
      error: 'malformatted parameters'
    });
  }
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

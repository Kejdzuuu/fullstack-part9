import express from 'express';
import { parseArguments } from './argumentParser';
import { calculateBmi } from './bmiCalculator';
const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

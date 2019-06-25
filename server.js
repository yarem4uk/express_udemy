import app from './application';

const port = 4000;

app().listen(port, () => {
  console.log(`app listening on port ${port}`);
});

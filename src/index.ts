import express from 'express';

function main() {
  const server = express();

  server.get('/running', (req, res) => {
    res.send('yes');
  })

  server.listen(3000, () => {
    console.log('api gateway started');
  });
}

main()

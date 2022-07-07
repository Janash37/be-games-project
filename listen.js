const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Now listening on ${PORT}...`));

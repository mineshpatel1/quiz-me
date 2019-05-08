exports.error = (res, err) => {
  if (err instanceof Error) {
    console.error(err.message);
    return res.send({ error: err.message });
  } else {
    console.error(err);
    return res.send({ error: err.toString() });
  }
}
exports.error = (res, err) => {
  console.error(err);
  return res.send({ error: err.toString() });
}
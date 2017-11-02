module.exports = (res, err, code) => {
  console.error('in error handler')
  console.error(err)
  return res.status(code).send(err)
}
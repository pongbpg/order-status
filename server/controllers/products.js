
exports.get = (req, res) => {
    const sql = `select * from products`
    req._sql.query(sql, [])
        .then(rows => {
            res.json(rows)
        })
}
exports.create = (req, res) => {
    res.json({ code: 200, msg: 'created' })
}
exports.update = (req, res) => {
    res.json({ code: 200, msg: 'updated' })
}
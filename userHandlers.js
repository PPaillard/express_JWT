const db = require("./db-config")

const postUser = (req, res) => {

    const { firstname, lastname, email, city, language, hashedPassword } = req.body;

    db.promise().query("INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?,?,?,?,?,?)", [firstname, lastname, email, city, language, hashedPassword])
        .then(([result]) => {
            res.location(`/api/users/${result.insertId}`).sendStatus(201)
        })
        .catch(console.error)
}

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const { email } = req.body
    db.promise().query("SELECT * FROM users WHERE email = ?", [email])
        .then(([users]) => {
            if (users[0]) {
                req.user = users[0]
                next();
            }
            else res.sendStatus(401);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error retrieving data from database");
        });
}

module.exports = {
    postUser,
    getUserByEmailWithPasswordAndPassToNext
}
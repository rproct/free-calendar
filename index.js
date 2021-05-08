const express = require("express")
const path = require("path")
const app = express()

app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    let date = new Date()
    console.log(`${date.getMonth()} ${date.getFullYear()}`)
    res.redirect(`/date?month=${date.getMonth()}&year=${date.getFullYear()}`)
})

app.get("/date", (req, res) => {
    res.json(require(path.join(__dirname, "public/output.json")))
})

app.listen(3000, () => {
    console.log("Express is running...")
})
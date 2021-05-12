const express = require("express")
const path = require("path")
const app = express()
const ejs = require("ejs")
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

var date, i, events

app.get("/", (req, res) => {
    let currentDate = new Date()
    console.log(`${currentDate.getMonth()} ${currentDate.getFullYear()}`)
    res.redirect(`/date?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}`)
})

app.get("/date", async (req, res) => {
    let month = req.query.month
    let year = req.query.year
    events = parseJSON(req.query.events)
    // console.log(events.filter(o => o.day === 22))
    date = new Date(year, month)
    let content = await render("./views/index.ejs", {
        "title": "Test",
        "monthName": months[month],
        "year": year,
        "weeks": populateWeeks()
    })
    res.send(content)
})

function parseJSON(json){
    let parse = []
    if(typeof json === "undefined")
        return parse
    for(let j = 0; j < json.length; j++)
        parse.push(JSON.parse(json[j]))
    return parse
}

function populateWeeks(){
    let html = ""
    let week = `<div class="week">`
    let weekend = `<div class="day weekend">`
    let day = `<div class="day">`
    let end = `</div>`
    html = week + setOffset()
    html = html + setDays(week, day, weekend, end)
    return html
}

function setOffset(){
    let html = ""
    for(i = 0; i < date.getDay(); i++)
        html = html + `<div class="day offset"></div>`
    return html
}

function setDays(week, day, wn, end){
    let html = ""
    let last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    for(let j = 1; j <= last; j++){
        if(i % 6 === 0)
            html = html + wn
        else html = html + day
        html = html + `<h3>${j}</h3>`
        let num = getEventLength(j)
        if(num > 0) {
            html += makeModal(j)
        }
        html += end
        i++
        if(i >= 7){
            html = html + end + week
            i = 0
        }
    }
    for(;i < 7; i++){
        html = html + `<div class="day offset"></div>`
    }
    html = html + end
    return html
}

function getEventLength(day){
    let num = events.filter(o => o.day === day).length
    return num
}

function makeModal(day){
    let html = `<div class="dropdown">
                    <h3>${getEventLength(day)} Events</h3>
                    <div class="dropdown-content">
                    <h2 class="center">${months[date.getMonth()]} ${day}, ${date.getFullYear()}</h2>
                        <table>`
    let currentEvents = events.filter(o => o.day === day)
    for(let j = 0; j < currentEvents.length; j++){
        html += `<tr><th>${currentEvents[j].event}</th><td>${currentEvents[j].time}</td></tr>`
    }
    html += `</table></div></div>`
    return html
}

const render = (file, data) => {
    return new Promise(resolve => {
        ejs.renderFile(file, data, (err, result) => {
            if(err)
                console.log(err)
            resolve(result)
        })
    })
}

app.listen(port, () => {
    console.log("Express is running...")
})
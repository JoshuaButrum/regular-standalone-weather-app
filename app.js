const express = require('express')
const app = express()
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const port = 3000

app.use(express.static('public'))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Josh Butrum'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Josh Butrum'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Josh Butrum',
        helpText: 'This is some helpful text.'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    } else {
        geocode(req.query.address, (error, { latitude, longitude, location }) => {
            if (error) {
                return res.send({ error })
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({ error })
                } else {
                    res.send({
                        forecast: forecastData,
                        location,
                        address: req.query.address
                    })
                }
            })
        })
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const address = process.argv[2]

if (address) {
    geocode(address, (error, { latitude, longitude, location }) => {
        if (error) {
            console.log(error)
        } else {
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(location)
                    console.log(forecastData)
                }
            })
        }
    })
}

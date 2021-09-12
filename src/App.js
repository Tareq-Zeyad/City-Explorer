import axios from 'axios';
import React from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Weather from './components/Weather';
import Movies from './components/Movies';
import Error from "./components/Error";



class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      lon: '',
      displayName: '',
      weatherArr: [],
      moviesArr: [],
      mapFlag: false,
      displayErr: false
    };
  }


  getLocationData = async (event) => {

    event.preventDefault();
    let cityName = event.target.cityName.value;
    // console.log(1, cityName);
    let URL1 = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&q=${cityName}&format=json`;
    let URL2 = `https://city-explorer-server01.herokuapp.com/weather?searchQuery=${cityName}`;
    let URL3 = `https://city-explorer-server01.herokuapp.com/movies?searchQuery=${cityName}`;
    
    // console.log(URL1, URL2, URL3);
    // console.log(process.env.REACT_APP_SERVER_LINK);
    // weather bit API http://api.weatherbit.io/v2.0/forecast/daily?city=${search}&key=${weatherAPI}
    // movies DB API https://api.themoviedb.org/3/search/movie?api_key=${movieAPI}&query=${search}

    try {
      // axious : to send a request from the client side (browser) to the API server.
      let locationInfo = await axios.get(URL1);
      console.log(locationInfo.data);

      let weatherInfo = await axios.get(URL2);
      console.log(weatherInfo.data);

      let moviesInfo = await axios.get(URL3);
      console.log(moviesInfo.data);



      this.setState({
        lat: locationInfo.data[0].lat,
        lon: locationInfo.data[0].lon,
        displayName: locationInfo.data[0].display_name,

        weatherArr: weatherInfo.data,
        moviesArr: moviesInfo.data,

        mapFlag: true,
      })
    }

    catch {
      console.log('error');
      this.setState({
        displayErr: true
      })
    }
  }


  render() {
    return (
      <>
        <Header className="Header" />
        <Form className="Form" onSubmit={this.getLocationData}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Enter City</Form.Label>
            <Form.Control name='cityName' type="text" placeholder="Enter City Name here" />
          </Form.Group>
          <Button type='submit'>Explore</Button>
        </Form>

        {/* Render the city data */}
        <div id="location">
          <p>Display Name: {this.state.displayName}</p>
          <p>Lat : {this.state.lat}</p>
          <p>Lon : {this.state.lon}</p>


          {this.state.mapFlag && <img src={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATION_IQ_KEY}&center=${this.state.lat},${this.state.lon}`} alt='map' />}

          {this.state.displayErr && <p>Sorry some errors may occured</p>}
        </div>

        <div id="weather">
          {this.state.mapFlag && (
            <Weather
              weather={this.state.weatherArr.map(item => {
                return (
                  <>

                    <p> Date: {item.date} </p>
                    <p> Description: {item.description}</p>
                  </>
                );
              })}
            />
          )}
        </div>

        <div>
          {this.state.mapFlag && (
            <Movies
              movies={this.state.moviesArr.map(item => {
                return (
                  <>
                    <p>Title: {item.title}</p>
                    image: <img src={item.image_url} />
                    <p>Overview: {item.overview}</p>
                    <p>Total votes: {item.total_votes}</p>
                    <p>Popularity: {item.popularity}</p>
                    <p>Released on: {item.released_on}</p>
                  </>
                );
              })}
            />
          )}
        </div>
        <Error err={this.state.displayErr} />
        <Footer />
      </>
    )
  }

}
export default App;
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import tripContext from '../contexts/tripContext';
import moment from 'moment';
import TravelCard from "./TravelCard";
import {
  carriage1,
  carriage2,
  carriage3,
  carriage4,
  carriage5,
  carriage6,
  carriage7,
  carriage8,
  portrait1,
  portrait2,
  portrait3,
  portrait4,
  portrait5,
  portrait6,
  portrait7,
  portrait8
} from './images/images'
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import NoTripsAvailable from "./NoTripsAvailable";

const TripSearchResults = () => {
  const {
    selectedDate,
    departureCityCoordinates,
    arrivalCityCoordinates,
  } = useContext(tripContext);
  const apiURL = 'https://public-api.blablacar.com';
  const search = '/api/v3/trips/?';
  const key = 'key=dNuojyjDSdhDtLc0HWMRHie0u98j2En9';
  const radius = "radius_in_meters=100000";
  const currency = '&locale=fr-FR&currency=EUR';
  const formatDepartureCityCoordinates = `&from_coordinate=${departureCityCoordinates}`
  const formatArrivalCityCoordinates = `&to_coordinate=${arrivalCityCoordinates}`
  const [tripList, setTripList] = useState([]);
  const [tripIsLoading, setTripIsLoading] = useState(true);
  const [nameIsLoading, setNameIsLoading] = useState(true);
  const format1 = "YY-M-DDT";
  const formatDate = moment(selectedDate).format(format1);
  const month = moment(selectedDate).format('MM');
  const day = moment(selectedDate).format('DD');
  const [nameDay, setNameDay] = useState('');
  const formatedDate = `&start_date_local=20${formatDate}08:00:00&`
  const tripRequest = apiURL.concat('', search, key, formatDepartureCityCoordinates, formatArrivalCityCoordinates, currency, formatedDate, radius);

  const carriagesImagesArray = [
    carriage1, carriage2, carriage3, carriage4, carriage5, carriage6, carriage7, carriage8
  ];
  const portraitsArray = [
    portrait1, portrait2, portrait3, portrait4, portrait5, portrait6, portrait7, portrait7, portrait8
  ]
  const randomizeArray = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while(0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  //Request for Bordeaux Paris
  useEffect(() => {
    Axios.get(tripRequest)
    .then(res => res.data)
    .then(data => setTripList(data.trips))      
    .then(setTripIsLoading(false));
    randomizeArray(carriagesImagesArray);
    randomizeArray(portraitsArray);

    Axios.get(`https://api.abalin.net/namedays?country=fr&month=${month}&day=${day}`)
    .then(res => res.data)
    .then(data => setNameDay(data.data.namedays.fr))
    .then(setNameIsLoading(false))
  }, [formatedDate])

  if(tripIsLoading || nameIsLoading){
    return <CircularProgress />
  }

  //TODO: add loader and prevent notripsavailable from showing

  if (!tripIsLoading && tripList.length === 0){
    return <NoTripsAvailable date={formatedDate}/>
  }
  


  return ( 
    
    <Grid
    container
    direction='column'
    justify='space-around'
    alignItems='center'
    >
      {/* <Typography>Happy nameday to all {nameDay}s!</Typography> */}
    {tripList.map((tripListItem, index) => {
      const link = tripListItem.link
      const idIndex = link.indexOf('&') + 4;
      const id = link.slice(idIndex)
      return (
      <TravelCard 
      key={id}
      departure = {tripListItem.waypoints[0].place.city}
      arrival = {tripListItem.waypoints[1].place.city}
      duration = {Math.round(tripListItem.duration_in_seconds / 3600) * 10}
      price = {tripListItem.price.amount}
      backgroundImage= {carriagesImagesArray[index]}
      portrait= {portraitsArray[index]}
      />
      
      )
    })}
    </Grid>
      
   );
}
 
export default TripSearchResults;
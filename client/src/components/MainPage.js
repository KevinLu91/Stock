import React,{ useEffect } from 'react';
import axios from 'axios';

const MainPage=() =>{

  useEffect(() =>{
    axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=WNO5RG2F6WH3QXI9')
      .then((data) =>{
        console.log(data.data)
      })
      .catch((e) =>{
        console.log(e)
      })
  }, [])

  return(
    <div>
      <h3>Min ekonomi</h3>
      <h3>Översikt </h3>
      <div>
        <p>Totalt värde</p>
        <p>Tillg. för köp</p>
        <p>Totala utveckling</p>
      </div>
    </div>
  )
}

export default MainPage;
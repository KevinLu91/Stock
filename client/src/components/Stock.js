import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  background: #fdfdfd;

  .stock_form{
    display: flex;
  }

  .stockTrade_container{
    margin-top: 35px;
    display: block; 
    padding 30px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px 2px rgba(201,201,201,1);
  }

  .trade_textField{
    padding: 7px;
  }

  .courtage_container{
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .space_item{
    margin: 0 5px;
    border-bottom: .5px dotted;
    color: #c2c2c2;
    width: 60%;
  }

  .price_container{
    display: flex;
    flex-direction: column;
    align-items: center;

    .totalPrice{
      font-size: 28px;
      line-height: 28px;
      font-weight: 700;
      margin-top: 5px;
      font-family: Roboto, Arial, sans-serif;
    }
  }

  .info_Text{
    padding-left: 15px;
    font-size: 11px;
    line-height: 16px;
  }

  .button_container{
    display: flex;
    justify-content: center;
    
    button{
      margin-top: 15px;
      margin-left: 5px;
    }
  }
`

const Stock = (props) =>{
  const [stockChartData, setStockChartData] = useState(null);
  const [loading, setLoading] = useState(true)
  const [APIFrequency, setAPIFrequency] = useState('');
  const [stockPrice, setStockPrice] = useState(0);
  const [courtagePrice, setCourtagePrice] = useState(0);
  const [amountOfStock, setAmountOfStock] = useState(0);

  
  useEffect(() =>{
    let stockChart = [];
    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${props.symbol}&interval=30min&apikey=WNO5RG2F6WH3QXI9`)
      .then((data) =>{
        if(data.data['Note']){
          setAPIFrequency(data.data['Note'])
        }
        for(const key in data.data['Time Series (30min)']){
          let words; 
          words = key.split(' ');
          stockChart.push({time: words[1].slice(0, 5), price: Math.round(data.data['Time Series (30min)'][key]['1. open'])})
        }
        setStockChartData(stockChart.splice(0, 14).reverse());   
      })
      .catch((e) =>{
        console.log(e)
      })
      .finally(() =>{
        setLoading(false);
      })
      
    },[props.symbol])

  useEffect(() =>{
    if(stockChartData){
      setStockPrice(stockChartData[stockChartData.length-1].price)
      courtage()
    }
  }, [stockChartData, amountOfStock,])

  const courtage = () =>{
    let courtageMini = 0.0025;
    if(amountOfStock > 0 && stockPrice*courtageMini*amountOfStock > 1){
      setCourtagePrice(Math.round(stockPrice*courtageMini*amountOfStock*100)/100);
    }
    if(amountOfStock > 0 && stockPrice*courtageMini*amountOfStock < 1){
      setCourtagePrice(1)
    }    
  }

  const handleChangeAmountStock = (e) =>{
    setAmountOfStock(e.target.value)
  }

  let loadingReturn;
  if(loading){
    loadingReturn = (<div>Loading...</div>)
  } else{
    loadingReturn = (<div>
      <AreaChart
        width={600}
        height={500}
        data={stockChartData}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis type="number" domain={['dataMin - 5', 'dataMax+5']}/>
        <Tooltip />
        <Area type="monotone" dataKey="price" stroke="#81cba1" fill="#e5f4eb" />
      </AreaChart>
    </div>
    )
  }

  return(
    <Container>
      {!APIFrequency ? 
        <div>
          <h3>{props.name}</h3>
          {loadingReturn}
        </div>
      : <div>{APIFrequency}</div>}
      <div className='stockTrade_container'>
        <form className='stock_form' noValidate autoComplete="off">
          <div className='trade_textField'>
            <TextField
              inputProps={{ min: "0", step: "1" }}
              id="outlined-name"
              label="Amount"
              onChange={handleChangeAmountStock}
              type="number"
              variant="outlined"
            />
          </div>
          <div className='trade_textField'>
            <TextField
              id="outlined-name"
              label="Price in DOLLAR"
              
              value={stockPrice}
              variant="outlined"
            />
          </div>
        </form>
      <div>
        <p className='info_Text'>Available amount: strong'pengar på kontot'</p>
        <p className='info_Text'>Amount of owned stock: strong'antal akiter på kontot'</p>
      </div>
      <div>
        <div className='courtage_container'>
          <div>Courtage</div>
          <span className='space_item'></span>
          <span>{courtagePrice} USD</span>
          <div>
          </div>
        </div>
        <div className='price_container'>
          <h5>Total amount including charges:</h5>
          <div className='totalPrice'>
           {courtagePrice + (stockPrice * amountOfStock)} USD
          </div>
        </div>
        <div className='button_container'>
          <Button variant="contained" size="large" color="primary" className=''>
            Buy
          </Button>
          <Button variant="contained" size="large" color="secondary" className=''>
            Sell
          </Button>
        </div>
      </div>
      </div>
      
    </Container>
  )
}

export default Stock;
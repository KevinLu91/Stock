import axios from 'axios';


export const getSearchData = async (searchValue) =>{
  if(searchValue){
    try{
      const data = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchValue}&apikey=WNO5RG2F6WH3QXI9`);
  
      return data.data;
    } catch(e){
      console.log(e);
    }
  }
}

export const getStockData = async (symbol) =>{
    try{
      const data = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=WNO5RG2F6WH3QXI9`)
  
      return data.data;
    } catch(e){
      console.log(e)
    }
}


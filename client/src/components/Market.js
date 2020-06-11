import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { getSearchData } from '../api';
import Stock from './Stock';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .container_searchData{
    display: flex;
  }

  .searchData_container{
    display: flex;
    cursor: pointer;
    width: 80%;

    :hover{
      background: lightgrey;
    }
  }
`

const Market = () =>{
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState('');
  const [searchResponse, setSearchResponse] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [APIFrequency, setAPIFrequency] = useState('');
  

  useEffect(() =>{
     const fetchSearchPI = async () =>{
     setSearchData(await getSearchData(searchValue))
    }
    fetchSearchPI();

  }, [searchValue, setSearchData])

  useEffect(() =>{
    let array = [];

    if(searchData){
      for(let [key, value] of Object.entries(searchData)){
        if(key === 'Note'){
          return setAPIFrequency({value})
        }
      }
      for(const key in searchData['bestMatches']){
        let obj = {symbol: searchData['bestMatches'][key]['1. symbol'],
          name: searchData['bestMatches'][key]['2. name']
        }
        array.push(obj);
      }
    }
    setSearchResponse(array);
  }, [searchData])

  const handleSearchOnChange = (e) =>{
    setSearchValue(e.target.value)
  }

  const handleOnStock = (e) =>{
    setSymbol(e.target.dataset.id) 
    setName(e.target.id)
    setSearchValue('');
  }

  return(
    <Container>
      <form>
        <input onChange={handleSearchOnChange} value={searchValue}/>
      </form>
      {searchResponse ? searchResponse.map( x =>(
        <div 
          key={x.symbol} 
          className='searchData_container'
          data-id={x.symbol}
          id={x.name}
          onClick={handleOnStock}
        >
          <p>{x.name}</p>
          <p>{x.symbol}</p>
        </div>
      )): null}
     
      {APIFrequency ? <div>{APIFrequency.value}</div> : null}
      {symbol ? <Stock symbol={symbol} name={name}/> : <p>Pick your stock</p>}
    </Container>
  )
}

export default Market;


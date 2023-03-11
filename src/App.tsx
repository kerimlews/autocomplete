import React, { useDeferredValue, useEffect, useState } from 'react';
import './App.css';
import Autocomplete from './Autocomplete';
import { searchUsers } from './api';

function App() {
  const [options, setOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const defferedInputValue = useDeferredValue(inputValue);
    
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await searchUsers(inputValue);
        setOptions(result.users.map(user => `${user.firstName} ${user.lastName}`));
      } catch (error) {
        setOptions([]);
        console.log(error);
      }

      setIsLoading(false);
    };

    if (defferedInputValue) {
      fetchData();
    } else {
      setOptions([]);
    }
  }, [defferedInputValue]);
  
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>Autocomplete demo</p>

          <p>used https://dummyjson.com - search by firstName or lastName (not possible both)</p>
          <p>limitations - space in query return an empty response </p>
        </div>
          <Autocomplete options={options} inputValue={inputValue} isLoading={isLoading} onInputValueChange={setInputValue}  />
      </header>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [catData, setCatData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = 'live_THpRYiART8p0ld21cMe1UvT84knJeSP6TAUrhckqKJMSxoeos9sqLF0sBksf3LMe'; // Replace 'YOUR_API_KEY' with your actual Cat API key

  const fetchCatData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search?has_breeds=1', {
        headers: {
          'x-api-key': apiKey,
        },
      });
      const jsonData = await response.json();
      const filteredData = jsonData.filter(image => {
        return !banList.some(bannedAttribute => {
          return image.breeds && catData.breeds[0].weight.imperial && catData.breeds[0].origin && catData.breeds[0].life_span === bannedAttribute;
        });
      });
      if (filteredData.length > 0) {
        setCatData(filteredData[0]); // The Cat API returns an array with one object
      } else {
        // If there are no more images left after filtering, refetch data without ban list
        setBanList([]); // Clear the ban list to fetch new data without restrictions
        fetchCatData();
      }
      console.log('cat data: ', filteredData);
    } catch (error) {
      console.error('Error fetching cat data:', error);
    }
    setIsLoading(false);
  };

  const displayCatInfo = () => {
    if (!catData) return null;

    const handleBanAttribute = (attribute) => {
      setBanList([...banList, attribute]);
    };

    return (
      <div>
        <div className="detail">
          <div>
            <h2>Breed</h2>
            <button onClick={() => handleBanAttribute(catData.breeds ? catData.breeds[0].name : 'Unknown')}>
              {catData.breeds ? catData.breeds[0].name : 'Unknown'}
            </button>
          </div>
          <div>
            <h2>Weight</h2>
            <button onClick={() => handleBanAttribute(catData.breeds[0].weight.imperial)}>
              {catData.breeds[0].weight.imperial} lbs
            </button>
          </div>
          <div>
            <h2>Country</h2>
            <button onClick={() => handleBanAttribute(catData.breeds[0].origin)}>
              {catData.breeds[0].origin}
            </button>
          </div>
          <div>
            <h2>Life Span</h2>
            <button onClick={() => handleBanAttribute(catData.breeds[0].life_span)}>
              {catData.breeds[0].life_span} years
            </button>
          </div>
        </div>
        <div className="img-container">
          <img src={catData.url} alt="Cat" />
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchCatData();
  }, [banList]); // Fetch cat data when the component mounts or when banList changes

  return (
    <div className="App">
      <h1>Random Cat Facts and Images</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {displayCatInfo()}
          <button onClick={fetchCatData}>Fetch New Cat</button>
        </>
      )}
      <div className="ban-list">
        <h2>Ban List</h2>
        <ul>
          {banList.map((attribute, index) => (
            <p key={index}>{attribute}</p>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

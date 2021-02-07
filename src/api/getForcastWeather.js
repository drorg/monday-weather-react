function getForecast(e) {
        e.preventDefault();

        if (city.length === 0) {
            return setError(true);
        }

        // Clear state in preparation for new data
        setError("");
        setResponseObj({});
        
        setLoading(true);
        
        // const uriEncodedCity = encodeURIComponent(city);

        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&&units=${unit}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`,
        )
        .then(response => response.json())
        .then(response => {
            
            if (result.status === 200) {
                return { success: true, data: await result.json() };
            }
    
            return { success: false, error: result.statusText };
            
        })
        .catch(err => {
            return { success: false, error: err };
        });
    }
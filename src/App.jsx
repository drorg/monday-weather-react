import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import WeatherCard from "./components/weatherCard";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";


import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import logo from "./images/monday-logo-x2.png";


const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        alignItems: "center",
    },
    containerGrid: {
        flex: 1,
        overflowY: "auto",
        padding: "2em",
    },
    inputForm: {
        display: "flex",
        justifyContent: "center",
        padding: "1em",
    },
    title: {
        flexGrow: 1,
        textAlign: "center",
      },
      logo: {
        maxWidth: 150,
        marginRight: '100px'
      },
}));

const LOCAL_STORAGE_KEY = "locations";
function saveToLocalStorage(locations) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(locations));
}

function readFromLocalStorage() {
    const storedLocations = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedLocations ? JSON.parse(storedLocations) : [];
}

function App() {
    const classes = useStyles();
    const [weatherLocations, setWeatherLocations] = React.useState(readFromLocalStorage());  

    const [city, setCity] = React.useState('');
    const [unit, setUnit] = React.useState('metric');

    const [didSubmit, setDidSubmit] = React.useState(false);
    React.useEffect(() => {
        saveToLocalStorage(weatherLocations);
      }, [didSubmit]);

    const updateLocations = locations => {
        setWeatherLocations(locations);
        saveToLocalStorage(locations);
    };

    const removeAtIndex = index => () =>{
        updateLocations(weatherLocations.filter((_, locationIndex) => locationIndex !== index));
    }

    const canAddOrRemove = React.useMemo(() => weatherLocations.every(location => location !== ""), [weatherLocations]);

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <img src={logo} className={classes.logo} />
                    <Typography variant="h6" color="inherit" className={classes.title}>
                        Weather App
                    </Typography>
                </Toolbar>
            </AppBar>
            <FormControl component="fieldset">
                <TextField className={classes.inputForm}
                        type="text"
                        placeholder="Enter City"
                        maxLength="50"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}/>
                <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    className={classes.group}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}>
                        <FormControlLabel value="metric" control={<Radio />} label="Celcius" />  
                        <FormControlLabel value="standard" control={<Radio />} label="Kelvin" />
                </RadioGroup>
                <Button variant="contained" color="secondary"
                    onClick={() => { 
                        var cityName = city.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
                        if (!weatherLocations.some(location => location.cityName === cityName)) {
                            setWeatherLocations([...weatherLocations, {cityName,unit}]);
                            setDidSubmit(true);
                            setCity('');
                            setUnit('metric');
                        }
                    }}>
                    Add Location
                </Button>
            </FormControl>
            <Grid container spacing={3} className={classes.containerGrid}>
                {weatherLocations.map((location, index) => (
                    <Grid key={location} xs={12} sm={6} md={4} lg={3} item>
                        <WeatherCard
                            location={location}
                            canDelete={!location || canAddOrRemove}
                            onDelete={removeAtIndex(index)}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default App;
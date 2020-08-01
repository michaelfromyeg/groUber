import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Autocomplete from '@material-ui/lab/Autocomplete'
import * as firebase from 'firebase'
import { useHistory } from 'react-router-dom'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
  Suggestion
} from 'react-places-autocomplete'
import { Radio, Collapse } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))


function GuestForm () {
  const classes = useStyles()
  const history = useHistory()
  const db = firebase.firestore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [seats, setSeats] = useState('')

  const [checked, setChecked] = React.useState(false)

  // const handleChange = (event) => {
  //   setChecked(event.target.checked);
  // };

  function handleChange(address: string) {
    setAddress(address)
  }

  function handleSelect(address: string) {
    setAddress(address)
    geocodeByAddress(address)
      .then(results => {
        getLatLng(results[0])
      })
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error))
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Submit Your Information
        </Typography>
        <form
          className={classes.form}
          onSubmit={async (e) => {
            e.preventDefault()
            // const eventRef = await db.collection('events').add({
            //   name: name,
            //   name,
            //   organizerEmail: email
            // })
            // history.push(`/event/${eventRef.id}/organizer`)
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="event-name"
            label="Name"
            name="Name"
            autoFocus
            onChange={e => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Guest Email"
            label="Guest Email"
            id="email"
            autoComplete="email"
            onChange={e => setEmail(e.target.value)}
          />
          <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) =>
            {
              // const options = suggestions.map((suggestion) => suggestion.description)
              return (
                <div>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="location"
                    label="Your Location"
                    id="location"
                    autoComplete="location"
                    {...getInputProps({
                      placeholder: 'Search Places ...',
                      className: 'location-search-input'
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? 'suggestion-item--active'
                        : 'suggestion-item'
                        // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                        : { backgroundColor: '#ffffff', cursor: 'pointer' }
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}}
          </PlacesAutocomplete>
          <FormControlLabel
            control={<Checkbox
              checked={checked}
              onChange = {() => {
                setChecked(!checked)
              }}
              name="isDriver" />}
            label="Are you Driving?"
          />
          <Collapse in={checked}>
            <TextField
              id="standard-number"
              label="Number"
              type="number"
              fullWidth
              onChange = {(e) => setSeats(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Collapse>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
      <Box mt={8}>
      </Box>
    </Container>
  )
}

interface PlaceType {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      },
    ];
  };
}

export default GuestForm

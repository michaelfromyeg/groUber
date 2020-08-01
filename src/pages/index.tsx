import React from 'react'
import styles from '../styles/App.module.scss'
import EventForm from '../components/EventForm'
import { Button } from '@material-ui/core'
import firebase from 'firebase'

const index = () => {

  // const getFunction = async () => {
  //   const eventSnapshot = await db.collection("events").get()
  //   eventSnapshot.forEach((doc) => {
  //     console.log(doc.id, '=>', doc.data())
  //   })
  // }

  // getFunction()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={'/logo.png'} className={styles.logo} alt="logo" />
        <p>
          Create carpools, without the headache.
          <EventForm />
        </p>
      </header>
      <EventForm />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          firebase.auth().signOut()
        }}
      >
        Logout
      </Button>
    </div>
  )
}

export default index


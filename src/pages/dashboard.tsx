import React, { useState } from 'react'
import styles from '../styles/App.module.scss'
import * as firebase from 'firebase'
import { Event } from '../_types/event'
import { useParams, useHistory } from 'react-router-dom'
import { useDocument } from 'react-firebase-hooks/firestore'

//eslint-disable-next-line
const globalAny: any = global

const DashBoard = () => {

  const { eventId } = useParams()
  const history = useHistory()

  const [value, loading, error] = useDocument(
    firebase.firestore().collection('events').doc(eventId),
    {
      snapshotListenOptions: {
        includeMetadataChanges: true
      }
    }
  )

  if (!loading && !value?.data()) {
    globalAny.setNotification('error', 'Event not found.')
    history.push('/')
  }

  const event = value?.data()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={'/logo.png'} className={styles.logo} alt="logo" />
        <p>{event?.name}</p>
      </header>
    </div>
  )
}

export default DashBoard

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './app/navigation/Navigation'

import {firebaseApp} from './app/utils/FireBase'



export default function App() {
  return (
    <Navigation></Navigation>
  );
}


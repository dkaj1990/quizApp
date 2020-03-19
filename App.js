import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify from 'aws-amplify';
import config from './aws-exports';
import uuid from 'uuid/v4';
Amplify.configure(config);

import {API, graphqlOperation} from 'aws-amplify';
import { listDocuments as ListDocuments } from './src/graphql/queries';
import { createDocument as CreateDocument } from './src/graphql/mutations'

import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';

const Stack = createStackNavigator();

const CLIENT_ID = uuid()

class App extends React.Component {
  // define some state to hold the data returned from the API
  state = {
    name: '', description: '', expDate: '', remDate: '', documents: []
  }

  // execute the query in componentDidMount
  async componentDidMount() {
    try {
      const documentData = await API.graphql(graphqlOperation(ListDocuments))
      console.log('documentData:', documentData)
      this.setState({
        documents: documentData.data.listDocuments.items
      })
    } catch (err) {
      console.log('error fetching talks...', err)
    }
  }
  createDocument = async() => {
    const { name, description, expDate, remDate } = this.state
    if (name === '' || description === '' || expDate === '' || remDate === '') return

    const document = { name, description, expDate, remDate, clientId: CLIENT_ID }
    const documents = [...this.state.documents, document]
    this.setState({
      documents, name: '', description: '', expDate: '', remDate: ''
    })

    try {
      await API.graphql(graphqlOperation(CreateDocument, { input: document }))
      console.log('item created!')
    } catch (err) {
      console.log('error creating document...', err)
    }
  }
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  render() {
    return (
      <>
        <input
          name='name'
          onChange={this.onChange}
          value={this.state.name}
          placeholder='name'
        />
        <input
          name='description'
          onChange={this.onChange}
          value={this.state.description}
          placeholder='description'
        />
        <input
          name='expDate'
          onChange={this.onChange}
          value={this.state.expDate}
          placeholder='expDate'
        />
        <input
          name='remDate'
          onChange={this.onChange}
          value={this.state.remDate}
          placeholder='remDate'
        />
        <button onClick={this.createDocument}>Create Document</button>
        {
          this.state.documents.map((document, index) => (
            <div key={index}>
              <h5>{document.name}</h5>
              <p>{document.description}</p>
              <p>{document.expDate}</p>
              <p>{document.remDate}</p>
            </div>
          ))
        }
      </>
    )
  }
}



export default withAuthenticator(App, {
  includeGreetings: true
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 50
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
    marginVertical: 10
  },
  book: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10
  },
  title: { fontSize: 16 },
  author: { color: 'rgba(0, 0, 0, .5)' },
  expDate:{color: 'rgba(0, 0, 0, .5)'}
  
});

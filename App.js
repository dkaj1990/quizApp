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

class App extends React.Component {
  // define some state to hold the data returned from the API
  state = {
    documents: []
  }

  // execute the query in componentDidMount
  async componentDidMount() {
    try {
      const documentData = await API.graphql(graphqlOperation(ListDocuments))
      console.log('talkData:', DocumentData)
      this.setState({
        documents: documentData.data.listDocuments.items
      })
    } catch (err) {
      console.log('error fetching talks...', err)
    }
  }
  render() {
    return (
      <>
        {
          <View style={styles.container}>
          <TextInput
            style={styles.input}
            value={this.state.title}
            onChangeText={val => this.onChangeText('title', val)}
            placeholder="What do you want to track?"
          />
          <TextInput
            style={styles.input}
            value={this.state.author}
            onChangeText={val => this.onChangeText('author', val)}
            placeholder="Who does it belong to?"
          />
          <TextInput
            style={styles.input}
            value={this.state.expDate}
            onChangeText={val => this.onChangeText('expDate', val)}
            placeholder="When does it expire?"
          />
          <Button onPress={this.addBook} title="Add to Track-It" color="#eeaa55" />
          {this.state.documents.map((book, index) => (
            <View key={index} style={styles.book}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
              <Text style={styles.expDate}>{book.expDate}</Text>
            </View>
          ))}
        </View>
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

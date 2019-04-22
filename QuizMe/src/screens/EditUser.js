import React, { Component } from 'react';
import { View } from 'react-native';
// import Toast from 'react-native-easy-toast';

import { Container, Header, Text, Button, Form, Toast } from '../components/Core';
import { colours, styles } from '../styles';
import { utils, validators } from '../utils';

export default class EditUser extends Component {
  constructor(props) {
    super(props);
  }

  post(values) {
    this.refs.toast.show('Hello World');

    // fetch('http://10.0.2.2:3000/user/new', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: 'x@gmail.com',
    //   }),
    // })
    // .then((res) => res.json())
    // .then((res) => {
    //   if (res.hasOwnProperty('error')) {
    //     console.log('Error', res);
    //   } else {
    //     console.log('Done', res);
    //   }
    // })
    // .catch((error) => {
    //   console.log('Error', error);
    // });
  }

  render() {
    let { props, state } = this;
    let create = props.navigation.getParam('create', false);

    let title = 'Edit Profile';
    if (create) title = 'Sign Up';

    const categories = {
      1:  {id: 1,  name: 'General Knowledge', icon: 'question'},
      2:  {id: 2,  name: 'Sports', icon: 'futbol'},
      3:  {id: 3,  name: 'Science', icon: 'atom'},
      4:  {id: 4,  name: 'Geography', icon: 'globe-americas'},
      5:  {id: 5,  name: 'History', icon: 'landmark'},
      6:  {id: 6,  name: 'Film', icon: 'film'},
      7:  {id: 7,  name: 'Music', icon: 'music'},
      8:  {id: 8,  name: 'Literature', icon: 'book'},
      // 9:  {id: 9,  name: 'Quotes', icon: 'quote-right'},
      // 10: {id: 10, name: 'Mythology', icon: 'ankh'},
      11: {id: 11, name: 'TV', icon: 'tv'},
      12: {id: 12, name: 'Animals', icon: 'paw'},
      13: {id: 13, name: 'Puzzles & Riddles', icon: 'brain'},
    }

    let fields = {
      email: {
        label: "Email",
        icon: "envelope",
        type: "string",
        inputType: "text",
        validator: (val) => {return val && validators.isEmail(val)},
        format: (val) => { return val.toLowerCase() },
      },
      password: {
        label: "Password",
        icon: "lock",
        type: "string",
        inputType: "text",
        secure: true,
        validator: (val) => {
          if (!val) return false;
          return (
            validators.hasLower(val) && validators.hasUpper(val) &&
            validators.hasNumeric(val) && !validators.hasSpace(val)
          )
        },
      },
      confirmPassword: {
        label: "Confirm Password",
        icon: "lock",
        type: "string",
        inputType: "text",
        secure: true,
        validator: (val, formVals) => {return val && val == formVals.password},
      },
      nickname: {
        label: "Nickname",
        icon: "user",
        type: "string",
        inputType: "text",
        validator: (val) => { return validators.isAlphaNumeric(val)},
      }
    }

    let values = {
      category: 'Science',
      numQuestions: 5,
      username: null,
    }

    return (
      <Container>
        <Header title={title} route={'Home'} />
        <View style={[styles.f1, styles.col, styles.aCenter]}>
          <Form 
            fields={fields} values={values}
            onCancel={() => { this.navigation.goBack() }}
            onSuccess={values => {this.post(values)}}
          />
        </View>
        <Toast colour={colours.error} ref="toast" />
      </Container>
    )
  }
}
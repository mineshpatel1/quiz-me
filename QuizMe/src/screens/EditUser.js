import React, { Component } from 'react';
import { View } from 'react-native';

import { Container, Header, Button, Form } from '../components/Core';
import { colours, styles } from '../styles';
import { utils, validators } from '../utils';

export default class EditUser extends Component {
  constructor(props) {
    super(props);
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
      category: {
        label: "Category",
        default: 'General Knowledge',
        icon: "th",
        type: "string",
        inputType: "picker",
        options: Object.values(categories).map((c) => {return c.name}),
        validator: (val) => {
          return Object.values(categories).map((c) => {return c.name}).indexOf(val) > -1;
        },
      },
      numQuestions: {
        label: "Number of Questions",
        default: 10,
        icon: "question",
        type: "int",
        inputType: "text",
        validator: (val) => {return (3 <= val && val <= 50)},
      },
      username: {
        label: "Username",
        default: null,
        icon: "user",
        type: "string",
        inputType: "text",
        validator: (val) => {return val && validators.isAlphaNumeric(val)},
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
          <Form fields={fields} values={values} />
        </View>
      </Container>
    )
  }
}
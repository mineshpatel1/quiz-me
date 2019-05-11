import React, { Component } from 'react';
import { Animated, ScrollView, View, Easing } from 'react-native';

import { Container, Text, Icon } from '../components/Core';
import { styles, colours } from '../styles';
import { utils } from '../utils';
import { categories } from '../config';

const questionLib = require('../../assets/data/questions.json');

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bar: {},
      num: {},
      total: new Animated.Value(0),
      totalQs: 0,
    }
    for (id in categories) {
      this.state.bar[id] = new Animated.Value(0);
      this.state.num[id] = new Animated.Value(0);
    }

    let biggestCategory = 0;
    let totalQs = 0;
    summary = [];
    for (id in categories) {
      let catQs = questionLib.questions.filter((q) => {
        return q.category_id == id;
      });
      if (catQs.length > 0) {
        totalQs += catQs.length;
        summary.push({
          id: id,
          name: categories[id].name,
          icon: categories[id].icon,
          numQ: catQs.length,
        });
        if (biggestCategory < catQs.length) {
          biggestCategory = catQs.length;
        }
      }
    }
    this.state.summary = utils.sortByKey(summary, 'numQ', asc=false);
    this.state.biggestCategory = biggestCategory;
    this.state.totalQs = totalQs;

    let duration = 500;
    this.state.summary.forEach((cat, i) => {
      utils.animate(
        this.state.bar[cat.id],
        parseInt(100 * (cat.numQ / this.state.biggestCategory)),
        duration, null, Easing.quad, i * 100,
      )

      utils.animate(
        this.state.num[cat.id], 1, duration, null, Easing.quad, i * 100
      );
    });
    utils.animate(
      this.state.total, 1, duration, null, Easing.quad, summary.length * 100
    )
  }

  render() {
    let { props, state } = this;

    return (
      <Container header={'Question Summary'}>
        <View style={[styles.col, styles.pd15, styles.mt15, {flex: 4}]}>
          <ScrollView>
            {
              state.summary.map((cat, i) => (
                <View key={i} style={{marginBottom: 15}}>
                  <View style={[styles.row, {justifyContent: 'space-between'}]}>
                    <View style={[styles.row]}>
                      <Icon size={18} icon={cat.icon}></Icon>
                      <Text size={18} bold={true} style={{marginLeft: 10}}>{cat.name}</Text>
                    </View>
                    <Text animated={true} size={18} style={{opacity: state.num[cat.id]}}>
                      {cat.numQ}
                    </Text>
                  </View>
                  <Animated.View
                    style={{
                      marginTop: 5,
                      // width: parseInt(100 * (cat.numQ / state.biggestCategory)).toString() + '%',
                      height: 10,
                      backgroundColor: colours.primary,
                      width: state.bar[cat.id].interpolate({
                        inputRange: [0, 100], outputRange: ['0%', '100%'],
                      }),
                    }}
                  />
                </View>
              ))
            }
          </ScrollView>
        </View>
        <View style={[styles.f1, styles.center]}>
          <Text animated={true} bold={true} size={30} style={{opacity: state.total}}>
            {'Total: ' + state.totalQs.toString()}
          </Text>
        </View>
      </Container>
    )
  }
}

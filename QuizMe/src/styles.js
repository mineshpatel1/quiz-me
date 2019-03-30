import { StyleSheet } from 'react-native';

export const colours = {
  primary: '#48ABFF',
  lightBg: '#f4f4f4',
  danger: '#D9534F',
  success: '#5cb85c',
  disabled: '#b5b5b5',
  white: '#FFFFFF',
  black: '#000000',
  lightGrey: '#AAA'
};

const fontSize = {
  normal: 18,
  large: 24,
}

export const fonts = StyleSheet.create({
  normal: {
    fontFamily: 'Lato-Regular',
    fontSize: fontSize.normal,
  },
  bold: {
    fontFamily: 'Lato-Bold',
    fontSize: fontSize.normal,
  },
  display: {
    fontFamily: 'Lobster',
    fontSize: fontSize.large,
  },
  light: {
    color: colours.white,
  }
});

export const style = StyleSheet.create({
  f1: { flex: 1 },
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgTheme: {
    backgroundColor: colours.primary,
  },
  bgLight: {
    backgroundColor: colours.lightGrey,
  },
  shadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

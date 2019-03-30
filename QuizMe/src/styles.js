import { StyleSheet } from 'react-native';

export const colours = {
  primary: '#48ABFF',
  light: '#F4F4F4',
  danger: '#D9534F',
  success: '#5CB85C',
  disabled: '#B5B5B5',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#333333',
  midGrey: '#555555',
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

export const styles = StyleSheet.create({
  f1: { flex: 1 },
  f2: { flex: 2 },
  mt15: { marginTop: 15 },
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  bottomShadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
});

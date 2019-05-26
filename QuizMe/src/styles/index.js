import { StyleSheet } from 'react-native';

export const colours = {
  primary: '#48ABFF',
  primaryLight: '#96CEFF',
  primaryDark: '#1E76CD',
  light: '#F4F4F4',
  error: '#D9534F',
  success: '#5CB85C',
  disabled: '#B5B5B5',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#333333',
  midGrey: '#555555',
  lightGrey: '#AAAAAA',
  softGrey: '#CCCCCC',
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
  },
  light: {
    color: colours.white,
  }
});

export const styles = StyleSheet.create({
  f1: { flex: 1 },
  f2: { flex: 2 },
  f3: { flex: 3 },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt15: { marginTop: 15 },
  pd15: { padding: 15 },
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  aCenter: { alignItems: 'center' },
  jCenter: { justifyContent: 'center' },
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
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  bottomShadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  option: {
    flex: 1,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackBarContainer: {
    elevation: 40,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 0,
    bottom: 0,
    right: 0,
    paddingLeft: 10,
    paddingRight: 55
  },
  snackAction: {
    paddingLeft: 15, 
    paddingTop: 15, 
    paddingBottom: 15,
  },
});

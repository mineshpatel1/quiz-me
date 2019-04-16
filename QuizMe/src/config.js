export const animationDuration = 300;

export const categories = {
  1: {name: 'General Knowledge', icon: 'question'},
  2: {name: 'Sports', icon: 'futbol'},
  3: {name: 'Science', icon: 'atom'},
  4: {name: 'Geography', icon: 'globe-americas'},
  5: {name: 'History', icon: 'landmark'},
  6: {name: 'TV & Film', icon: 'film'},
  7: {name: 'Music', icon: 'music'},
  8: {name: 'Literature', icon: 'book'},
  9: {name: 'Quotes', icon: 'quote-right'},
  10:{name:  'Mythology', icon: 'ankh'},
}

export const defaultSettings = {
  'category': {
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
  'numQuestions': {
    label: "Number of Questions",
    default: 10,
    icon: "question",
    type: "int",
    inputType: "textInput",
    validator: (val) => {return (3 <= val && val <= 20)},
  },
  'timeLimit': {
    label: "Time Limit (s)",
    default: 10,
    icon: "hourglass-half",
    type: "int",
    inputType: "textInput",
    validator: (val) => {return (3 <= val && val <= 60)},
  },
  'waitTime': {
    label: "Wait Time (s)",
    default: 2,
    icon: "clock",
    type: "int",
    inputType: "textInput",
    validator: (val) => {return (1 <= val && val <= 10)},
  },
};

export const animationDuration = 300;

export const defaultSettings = {
  'numQuestions': {
    label: "Number of Questions",
    default: 10,
    icon: "question",
    type: "int",
    validator: (val) => {return (3 <= val && val <= 20)},
  },
  'timeLimit': {
    label: "Time Limit (s)",
    default: 60,
    icon: "clock",
    type: "int",
    validator: (val) => {return (3 <= val && val <= 60)},
  },
};

export const defaultTeams = [
  {'name': 'Red', 'colour': '#ef4747'},
  {'name': 'Blue', 'colour': '#39afe5'},
];

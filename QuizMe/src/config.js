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
    default: 10,
    icon: "hourglass-half",
    type: "int",
    validator: (val) => {return (3 <= val && val <= 60)},
  },
  'waitTime': {
    label: "Wait Time (s)",
    default: 2,
    icon: "clock",
    type: "int",
    validator: (val) => {return (1 <= val && val <= 10)},
  },
};

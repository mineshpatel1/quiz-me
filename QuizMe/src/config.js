const animationDuration = 300;

const settings = {
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

import os
import json
import types
import queue
import logging
import threading

QUESTION_LIB = 'QuizMe/assets/data/questions.json'
EXCLUDE = [
    'What was the First Console CREATED? 2 Answers for this!!!!1',
]


class CATEGORIES:
    GENERAL = {'id': 1, 'name': 'General Knowledge'}
    SPORTS = {'id': 2, 'name': 'Sports'}
    SCIENCE = {'id': 3, 'name': 'Science'}
    GEOGRAPHY = {'id': 4, 'name': 'Geography'}
    HISTORY = {'id': 5, 'name': 'History'}
    TV_FILM = {'id': 6, 'name': 'TV and Film'}
    MUSIC = {'id': 7, 'name': 'Music'}
    LITERATURE = {'id': 8, 'name': 'Literature'}
    QUOTES = {'id': 9, 'name': 'Quotes'}
    MYTHS = {'id': 10, 'name': 'Mythology'}


class Question:
    def __init__(self, id, question, options, answer, category=None, category_id=1):
        if not isinstance(id, int):
            raise TypeError("id must be an int.")

        if not isinstance(question, str):
            raise TypeError("question must be a string.")

        if not hasattr(options, '__iter__'):
            raise TypeError("options must be an iterable of strings.")

        if not len(options) == 4:
            raise ValueError("Question must have only 4 options.")

        for w in options:
            if not isinstance(w, str):
                raise TypeError("All options must be strings.")

        if not isinstance(answer, str):
            raise TypeError("answer must be a string.")

        if answer not in options:
            log.error('Answer: ' + answer)
            log.error(options)
            raise ValueError("Answer must be one of the available options.")

        if category is not None:
            if not hasattr(CATEGORIES, category.upper()):
                raise ValueError("category must be one of CATEGORIES.")
            category_id = getattr(CATEGORIES, category.upper())['id']

        if category_id is not None:
            for prop in dir(CATEGORIES):
                if not prop.startswith('__') and prop != 'KEYS':
                    if int(category_id) == getattr(CATEGORIES, prop)['id']:
                        category = prop
                        break
            if category is None:
                raise ValueError("Invalid category ID supplied, no matching category.")

        self.id = id
        self.question = question
        self.options = list(options)
        self.answer = answer
        self.category_id = category_id

    @property
    def dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'options': self.options,
            'answer': self.answer,
            'category_id': self.category_id,
        }

    def __hash__(self):
        return hash(self.question.lower())

    def __eq__(self, other):
        return self.question.lower() == other.question.lower()

    def __str__(self):
        return self.question


class QuestionSet:
    def __init__(self):
        self.questions = set()

    def add(self, q):
        if not isinstance(q, Question):
            raise TypeError("Can only add objects of type Question to the QuestionSet")
        if q not in self.questions:
            self.questions.add(q)

    def load(self):
        log.info('Loading questions from {}...'.format(QUESTION_LIB))
        with open(QUESTION_LIB) as f:
            data = json.load(f)

        for i, q in enumerate(data['questions']):
            _q = Question(i, q['question'], q['options'], q['answer'], category_id=q['category_id'])
            if _q not in self.questions:
                self.questions.add(_q)

    def save(self):
        log.info('Saving word sets to {}...'.format(QUESTION_LIB))
        out = {
            'questions': [q.dict for q in self.questions]
        }
        with open(QUESTION_LIB, 'w') as f:
            json.dump(out, f, indent=4)

    @property
    def q_id(self):
        return len(self.questions) + 1


def create_logger(name):

    class Formatter(logging.Formatter):
        def __init__(self, msg, datefmt='%Y-%m-%d %H:%M:%S'):
            logging.Formatter.__init__(self, msg)
            self.datefmt = datefmt

        def format(self, record):
            return logging.Formatter.format(self, record)

    def log_newline(self, lines=1):
        self.removeHandler(self.console_handler)
        self.addHandler(self.blank_handler)

        for _ in range(lines):
            self.info('')

        self.removeHandler(self.blank_handler)
        self.addHandler(self.console_handler)

    logger = logging.getLogger(name)
    if len(logger.handlers) == 0:
        logger.setLevel(logging.INFO)
        _format = '[%(levelname)-8s][%(asctime)s][%(name)s]    %(message)s'
        datefmt = '%Y-%m-%d %H:%M:%S'

        console_handler = logging.StreamHandler()
        colour_formatter = Formatter(_format, datefmt)
        console_handler.setFormatter(colour_formatter)
        logger.addHandler(console_handler)
        logger.console_handler = console_handler

        blank_handler = logging.StreamHandler()
        blank_handler.setLevel(logging.DEBUG)
        blank_handler.setFormatter(logging.Formatter(fmt=''))
        logger.blank_handler = blank_handler

        logger.newline = types.MethodType(log_newline, logger)

    return logger


log = create_logger("quizme")


def batch(_func):
    """
    Decorator to wrap a function so that it can run in multiple threads.
    Takes a list of tuples with the inputs of the child function.
    """
    def batch_wrap(
        _lst, num_threads=25, suppress_err_msg=False, raise_exception=False
    ):
        def worker():
            while True:
                item = q.get()
                try:
                    _func(*item)
                except Exception as err:
                    if not suppress_err_msg:
                        log.error('Error: {}'.format(err))
                    if raise_exception:
                        raise Exception(err)
                q.task_done()

        q = queue.Queue()

        for _i in range(num_threads):
            t = threading.Thread(target=worker)
            t.daemon = True
            t.start()

        for _item in _lst:
            if not isinstance(_item, tuple):
                q.put((_item,))
            else:
                q.put(_item)

        q.join()  # Wait for all operations to complete

    return batch_wrap


def questions_from_file(q_set, _dir, category):
    if not hasattr(CATEGORIES, category.upper()):
        raise ValueError("category must be one of CATEGORIES")

    for filename in os.listdir(_dir):
        if filename.startswith(category):
            with open(os.path.join(_dir, filename), 'r') as f:
                x = json.load(f)
                for q in x:

                    if not q['question'].startswith('<') and q['question'] not in EXCLUDE:
                        if len(q['answers']) > 4:
                            new_answers = [a for a in q['answers'] if a != q['answer']][:3]
                            new_answers.append(q['answer'])
                            q['answers'] = new_answers

                        if len(q['answers']) != 4:
                            continue

                        new_q = Question(
                            q_set.q_id, q['question'], q['answers'], q['answer'],
                            category_id=getattr(CATEGORIES, category.upper())['id']
                        )
                        q_set.add(new_q)


def main():
    pass


if __name__ == "__main__":
    main()

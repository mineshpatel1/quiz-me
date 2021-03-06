import html
import json
import types
import queue
import logging
import requests
import psycopg2
import threading

QUESTION_LIB = 'QuizMe/assets/data/questions.json'


class CATEGORIES:
    GENERAL = {'id': 1, 'name': 'General Knowledge', 'opendb_id': 9}
    SPORTS = {'id': 2, 'name': 'Sports', 'opendb_id': 21}
    SCIENCE = {'id': 3, 'name': 'Science', 'opendb_id': [17, 18, 19, 30]}
    GEOGRAPHY = {'id': 4, 'name': 'Geography', 'opendb_id': 22}
    HISTORY = {'id': 5, 'name': 'History', 'opendb_id': 23}
    FILM = {'id': 6, 'name': 'Film', 'opendb_id': 11}
    MUSIC = {'id': 7, 'name': 'Music', 'opendb_id': 12}
    LITERATURE = {'id': 8, 'name': 'Literature', 'opendb_id': 10}
    PEOPLE = {'id': 9, 'name': 'People & Quotes', 'opendb_id': 26}
    MYTHS = {'id': 10, 'name': 'Faith & Mythology', 'opendb_id': 20}
    TV = {'id': 11, 'name': 'TV', 'opendb_id': 14}
    ANIMALS = {'id': 12, 'name': 'Animals', 'opendb_id': 27}
    BRAIN = {'id': 13, 'name': 'Puzzles & Riddles'}
    ART = {'id': 14, 'name': 'Art', 'opendb_id': 25}
    POLITICS = {'id': 15, 'name': 'Politics', 'opendb_id': 24}
    VEHICLES = {'id': 16, 'name': 'Vehicles', 'opendb_id': 28}


class Question:
    def __init__(self, question, options, answer, category=None, category_id=1, id=None):
        if not isinstance(question, str):
            raise TypeError("question must be a string.")

        if not hasattr(options, '__iter__'):
            raise TypeError("options must be an iterable of strings.")

        if not (len(options) == 4 or len(options) == 2):
            raise ValueError("Question must have either 2 or 4 options.")

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
    def __init__(self, load=False):
        self.questions = set()
        if load:
            self.load()

    def add(self, q):
        if not isinstance(q, Question):
            raise TypeError("Can only add objects of type Question to the QuestionSet")

        q.id = self.max_id + 1
        if q not in self.questions:
            self.questions.add(q)

    def load(self):
        log.info('Loading questions from {}...'.format(QUESTION_LIB))
        with open(QUESTION_LIB) as f:
            data = json.load(f)

        for q in data['questions']:
            _q = Question(
                q['question'], q['options'], q['answer'], category_id=q['category_id'], id=q['id'],
            )
            if _q not in self.questions:
                self.questions.add(_q)

    def save(self):
        log.info('Saving word sets to {}...'.format(QUESTION_LIB))
        questions = [q.dict for q in self.questions]
        questions.sort(key=lambda x: x['id'])

        out = {
            'questions': questions
        }
        with open(QUESTION_LIB, 'w') as f:
            json.dump(out, f, indent=4)

    def reset_ids(self):
        log.info('Resetting IDs of question set.')
        _questions = list(self.questions)
        self.questions = set()
        for q in _questions:
            self.add(q)

    @property
    def max_id(self):
        ids = [q.id for q in self.questions]
        if len(ids) == 0:
            return 0
        else:
            return max(ids)

    @property
    def continuous_ids(self):
        ids = [q.id for q in self.questions]
        ids = sorted(ids)

        for i, id in enumerate(ids):
            if (i + 1) != id:
                return False
        return True

    @property
    def questions_ordered(self):
        return sorted(self.questions, key=lambda x: x.id)


def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]


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


def read_from_opentriviaqa(category_id, fpath):
    """Parses questions from files found in https://github.com/uberspot/OpenTriviaQA"""
    q_set = QuestionSet(load=True)

    question = None
    question_flg = False
    options = []

    i = 0
    log.info('Parsing questions from {}...'.format(fpath))
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if len(line.strip()) == 0:
                continue

            if line.startswith('#Q'):
                if question is not None:
                    if (len(options) == 4 or len(options) == 2) and answer in options:
                        q_set.add(Question(question.strip(), options, answer, category_id=category_id))
                        i += 1

                question_flg = True
                question = line[2:].strip()
                answer = None
                options = []

            if line.startswith('^'):
                question_flg = False
                answer = line[1:].strip()

            if (not question_flg) and line.startswith(('A', 'B', 'C', 'D')):
                options.append(line[1:].strip())

            if question_flg:
                if not line.startswith('#Q'):
                    question += ' ' + line

    # Add last question
    if question is not None:
        q_set.add(Question(question.strip(), options, answer, category_id=category_id))
        i += 1

    log.info('Parsed {} questions from {}'.format(i, fpath))
    q_set.save()
    return q_set


def read_from_opentriviadb(category):
    """Parses questions from OpenTriviaDB"""
    q_set = QuestionSet(load=True)

    base_url = "https://opentdb.com/"
    r = requests.get(base_url + 'api_token.php?command=request')
    token = r.json()['token']

    q_count = 0

    opendb_categories = category['opendb_id']
    if not isinstance(opendb_categories, list):
        opendb_categories = [opendb_categories]

    for cat in opendb_categories:
        fetch, amount = True, 50
        while fetch:
            r = requests.get(base_url + 'api.php?amount={}&category={}&token={}'.format(
                amount, cat, token,
            ))
            results = r.json()
            if results['response_code'] == 0:
                for q in results['results']:
                    question = html.unescape(q['question']).strip()
                    answer = html.unescape(q['correct_answer'])
                    options = [html.unescape(s) for s in q['incorrect_answers']] + [answer]
                    q_set.add(Question(question, options, answer, category_id=category['id']))
                    q_count += 1
            elif results['response_code'] in [1, 4]:
                if amount == 50:
                    amount = 10
                else:
                    log.info('End of question set reached.')
                    fetch = False
            else:
                log.info('Unexpected error: {}'.format(results['response_code']))
                log.info(results)
                fetch = False

    log.info('Parsed {} questions.'.format(q_count))
    q_set.save()
    return q_set


def full_load_db_from_file(batch_size=10000):
    """Truncates DB and loads questions from QUESTION_LIB JSON."""

    q_set = QuestionSet(load=True)
    with open('.config/config.json', 'r') as f:
        config = json.load(f)
        config = config['pg']

    conn = psycopg2.connect(
        host=config['host'],
        database=config['db'],
        user=config['user'],
        password=config['password'],
    )

    i, values = 0, []
    for q in q_set.questions_ordered:
        values.append((
            q.id,
            q.question,
            q.options,
            q.answer,
            q.category_id,
        ))
        i += 1

    cur = conn.cursor()
    cur.execute('TRUNCATE TABLE questions')
    query = """
            INSERT INTO questions (id, question, options, answer, category_id)
            VALUES {}
            """

    j = 0
    log.info("Writing {} questions to DB...".format(i))
    for chunk in chunks(values, batch_size):
        log.info('Batch {}...'.format(j + 1))
        j += 1

        args = ','.join(cur.mogrify("(%s, %s, %s, %s, %s)", v).decode("utf-8") for v in chunk)
        cur.execute(query.format(args))
        conn.commit()

    log.info("Data transfer complete.")
    cur.close()


def main():
    pass


if __name__ == "__main__":
    main()

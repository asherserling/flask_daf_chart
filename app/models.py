from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, current_user
from datetime import datetime

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    progress_summary = db.relationship('PledgeSummary', backref='learner', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

    def get_user_data(self) -> dict:
        progress_summary = self.progress_summary.first()
        pledge = progress_summary.pledge
        completed = progress_summary.completed
        remaining = pledge - completed
        average = progress_summary.average
        start_date = progress_summary.start_date
        end_date = progress_summary.end_date
        return {
            'summary': {
                'pledge': pledge,
                'completed': completed,
                'remaining': remaining,
                'average': average,
                'start_date': start_date,
                'end_date': end_date
            },
            'masechtas': self._get_masechtas(),
        }

    def _get_masechtas(self):
        masechtas = []
        for masechta_n_times in _masechta_tables:
            masechtas += [
                masechta.progress_dict()
                for masechta in masechta_n_times.query.filter_by(user_id=self.id)
            ]
        return masechtas

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class PledgeSummary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.String(120))
    end_date = db.Column(db.String(120))
    pledge = db.Column(db.Integer)
    completed = db.Column(db.Integer)
    average = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


    def set_average(self):
        start_date = datetime.fromisoformat(self.start_date)
        today = datetime.now()
        elapsed_days = (today - start_date).days + 1
        average = self.completed / elapsed_days
        self.average = round(average, 1)

class Masechta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), index=True, nullable=False)
    length = db.Column(db.Integer, nullable=False)
    def __repr__(self):
        return f"<Masechta {self.title}>"

class Masechta2Times(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    masechta_id = db.Column(db.Integer, db.ForeignKey('masechta.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    first_time = db.Column(db.Integer)
    second_time = db.Column(db.Integer)

    def progress_dict(self):
        return _progress_dict(self, 2)


class Masechta3Times(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    masechta_id = db.Column(db.Integer, db.ForeignKey('masechta.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    first_time = db.Column(db.Integer)
    second_time = db.Column(db.Integer)
    third_time = db.Column(db.Integer)

    def progress_dict(self):
        return _progress_dict(self, 3)

class Masechta4Times(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    masechta_id = db.Column(db.Integer, db.ForeignKey('masechta.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    first_time = db.Column(db.Integer)
    second_time = db.Column(db.Integer)
    third_time = db.Column(db.Integer)
    fourth_time = db.Column(db.Integer)

    def progress_dict(self):
        return _progress_dict(self, 4)


class Masechta5Times(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    masechta_id = db.Column(db.Integer, db.ForeignKey('masechta.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    first_time = db.Column(db.Integer)
    second_time = db.Column(db.Integer)
    third_time = db.Column(db.Integer)
    fourth_time = db.Column(db.Integer)
    fifth_time = db.Column(db.Integer)

    def progress_dict(self):
        return _progress_dict(self, 5)

class Masechta6Times(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    masechta_id = db.Column(db.Integer, db.ForeignKey('masechta.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    first_time = db.Column(db.Integer)
    second_time = db.Column(db.Integer)
    third_time = db.Column(db.Integer)
    fourth_time = db.Column(db.Integer)
    fifth_time = db.Column(db.Integer)
    sixth_time = db.Column(db.Integer)

    def progress_dict(self):
        return _progress_dict(self, 6)

class Masechta7Times(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    masechta_id = db.Column(db.Integer, db.ForeignKey('masechta.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    first_time = db.Column(db.Integer)
    second_time = db.Column(db.Integer)
    third_time = db.Column(db.Integer)
    fourth_time = db.Column(db.Integer)
    fifth_time = db.Column(db.Integer)
    sixth_time = db.Column(db.Integer)
    seventh_time = db.Column(db.Integer)

    def progress_dict(self):
        return _progress_dict(self, 7)

_masechta_tables = [Masechta2Times,
                   Masechta3Times,
                   Masechta4Times,
                   Masechta5Times,
                   Masechta6Times,
                   Masechta7Times]

_repetitions_fields = {  '1': 'first_time',
                         '2': 'second_time',
                         '3': 'third_time',
                         '4': 'fourth_time',
                         '5': 'fifth_time',
                         '6': 'sixth_time',
                         '7': 'seventh_time'}


def _progress_dict(masechta_n_times, amount):
    masechta_info = Masechta.query.filter_by(id=masechta_n_times.masechta_id).first()
    title = masechta_info.title.capitalize()
    length = masechta_info.length

    repetitions = {}
    repetitions['amount'] = amount;
    for i in range(1, amount+1):
        key = _repetitions_fields.get(str(i))
        value = masechta_n_times.__dict__.get(key)
        repetitions[key] = value

    return {
        'name': title,
        'length': length,
        'row_id': masechta_n_times.id,
        'repetitions': repetitions
    }

def update_amud_data(amud_data):
    def update_masechta_table():
        table = eval('Masechta' + str(amud_data['amount']) + 'Times')
        row = table.query.get(amud_data['row_id'])
        increment_field_value(row, amud_data['field'])
        db.session.commit()

    def update_summary_table():
        summary = PledgeSummary.query.filter_by(user_id=current_user.id).first()
        summary.completed += .5
        summary.set_average()
        db.session.commit()

    update_masechta_table()
    update_summary_table()

def increment_field_value(masechta_n_times, field_name):
    if field_name == 'first_time':
        masechta_n_times.first_time += 1
    elif field_name == 'second_time':
        masechta_n_times.second_time += 1
    elif field_name == 'third_time':
        masechta_n_times.third_time += 1
    elif field_name == 'fourth_time':
        masechta_n_times.fourth_time += 1
    elif field_name == 'fifth_time':
        masechta_n_times.fifth_time += 1
    elif field_name == 'sixth_time':
        masechta_n_times.sixth_time += 1
    elif field_name == 'seventh_time':
        masechta_n_times.seventh_time += 1
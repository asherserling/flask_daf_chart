from app import app, db 
from app.forms import LoginForm, RegistrationForm
from app.models import User, update_amud_data, PledgeSummary
from flask import render_template, url_for, request, redirect
from flask_login import current_user, login_user, login_required, logout_user
import json

routes = {
    "index": '/index',
    "login": '/login',
    "logout": '/logout',
    "register": '/register',
    "data": '/data',
}


@app.route('/')
@app.route(routes['index'])
@login_required
def index():
    data = current_user.get_user_data()
    summary = data.get('summary')
    return render_template('index.html', data=data, summary=summary)


@app.route('/data', methods=['GET', 'POST'])
@login_required
def data():
    if request.method == 'GET':
        data = current_user.get_user_data()
        return json.dumps(data)
    elif request.method == 'POST':
        amud_data = request.form['amud_data']
        update_amud_data(json.loads(amud_data))
        return ""


@app.route(routes['login'], methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for('index'))
    return render_template('login.html', form=form)


@app.route(routes['logout'])
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route(routes['register'], methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        new_user = create_new_user(form)
        print(new_user.id)
        login_user(new_user, remember=form.remember_me.data)
        return redirect(url_for('index'))
    return render_template('register.html', form=form)


def create_new_user(form):
    new_user = User(
        username=form.username.data,
        email=form.email.data
    )
    new_user.set_password(form.password.data)
    db.session.add(new_user)
    db.session.commit()
    return new_user

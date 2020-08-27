from app import app
from app.forms import LoginForm
from app.models import User, update_amud_data
from flask import render_template, url_for, request, redirect
from flask_login import current_user, login_user, login_required
import json



@app.route('/')
@app.route('/index')
@login_required
def index():
    data = current_user.get_user_data()
    summary = data.get('summary')
    return render_template('index-javascript.html', summary=summary)


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

@app.route('/login', methods=['GET', 'POST'])
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


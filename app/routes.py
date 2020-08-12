from app import app
from flask import render_template, url_for, request, redirect
from app.forms import LoginForm


@app.route('/')
@app.route('/index')
def index():
    return render_template('index-javascript.html')


@app.route('/data')
def data():
    data_path = 'C:\\Users\\Asher\\Desktop\\flask_daf_chart\\app\\static\\data\\data2.json'
    my_data = open(data_path).read()
    return my_data

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if request.method == 'GET':
        return render_template('login.html', form=form)
    else:
        print(form.username.data)
        return redirect(url_for('index'))



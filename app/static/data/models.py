import sqlalchemy as sa

class User:
    id = sa.Column(sa.String, primary_key=True)
    created_date = sa.Column(sa.DateTime)
    username = sa.Column(sa.String)
    email = sa.Column(sa.String)
    password_hash = sa.Column(sa.String)



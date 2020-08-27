"""empty message

Revision ID: 4891b875fd2a
Revises: 4d5d60c8ae08
Create Date: 2020-08-24 09:45:37.351483

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4891b875fd2a'
down_revision = '4d5d60c8ae08'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('pledge_summary',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('pledge', sa.Integer(), nullable=True),
    sa.Column('completed', sa.Integer(), nullable=True),
    sa.Column('avergae', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('pledge_summary')
    # ### end Alembic commands ###
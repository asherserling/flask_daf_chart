"""empty message

Revision ID: 8ad974381427
Revises: 0c17ce5dbf7d
Create Date: 2020-08-24 10:11:14.137967

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8ad974381427'
down_revision = '0c17ce5dbf7d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('pledge_summary', sa.Column('end_date', sa.String(length=120), nullable=True))
    op.add_column('pledge_summary', sa.Column('start_date', sa.String(length=120), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('pledge_summary', sa.Column('avergae', sa.INTEGER(), nullable=True))
    op.drop_column('pledge_summary', 'start_date')
    op.drop_column('pledge_summary', 'end_date')
    # ### end Alembic commands ###

"""empty message

Revision ID: 0c17ce5dbf7d
Revises: 4891b875fd2a
Create Date: 2020-08-24 09:47:31.856663

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0c17ce5dbf7d'
down_revision = '4891b875fd2a'
branch_labels = None
depends_on = None


def upgrade():
    pass
    # ### commands auto generated by Alembic - please adjust! ###
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('pledge_summary', sa.Column('avergae', sa.INTEGER(), nullable=True))
    op.drop_column('pledge_summary', 'average')
    # ### end Alembic commands ###

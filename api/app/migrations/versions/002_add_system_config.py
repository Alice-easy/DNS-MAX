"""Add system config table

Revision ID: 002_add_system_config
Revises: 001_initial
Create Date: 2025-10-05 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002_add_system_config'
down_revision = '001_initial'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create system_config table
    op.create_table('system_config',
        sa.Column('key', sa.String(length=128), nullable=False),
        sa.Column('value', sa.Text(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('key')
    )


def downgrade() -> None:
    op.drop_table('system_config')

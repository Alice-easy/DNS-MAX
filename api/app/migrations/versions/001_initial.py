"""Initial migration

Revision ID: 001_initial
Revises: 
Create Date: 2025-10-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=254), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('admin', 'user', name='role'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('email_verified_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Create email_tokens table
    op.create_table('email_tokens',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('token', sa.String(length=128), nullable=False),
        sa.Column('expire_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_email_tokens_token'), 'email_tokens', ['token'], unique=True)
    op.create_index(op.f('ix_email_tokens_expire_at'), 'email_tokens', ['expire_at'], unique=False)

    # Create domains table
    op.create_table('domains',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=253), nullable=False),
        sa.Column('provider', sa.String(length=32), nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_domains_name'), 'domains', ['name'], unique=True)

    # Create allocations table
    op.create_table('allocations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('domain_id', sa.Integer(), nullable=False),
        sa.Column('subdomain', sa.String(length=63), nullable=False),
        sa.Column('type', sa.String(length=16), nullable=False),
        sa.Column('value', sa.String(length=255), nullable=False),
        sa.Column('ttl', sa.Integer(), nullable=False),
        sa.Column('status', sa.Enum('pending', 'active', 'disabled', name='allocationstatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['domain_id'], ['domains.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('domain_id', 'subdomain', 'type', name='uq_record')
    )


def downgrade() -> None:
    op.drop_table('allocations')
    op.drop_index(op.f('ix_domains_name'), table_name='domains')
    op.drop_table('domains')
    op.drop_index(op.f('ix_email_tokens_expire_at'), table_name='email_tokens')
    op.drop_index(op.f('ix_email_tokens_token'), table_name='email_tokens')
    op.drop_table('email_tokens')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')

"""Adicionando imagens

Revision ID: 3f437dd25c7d
Revises: 66ff9bbe8a77
Create Date: 2025-11-29 11:22:38.910100

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3f437dd25c7d'
down_revision = '66ff9bbe8a77'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        ALTER TABLE switches 
        ADD COLUMN image_path VARCHAR(255) DEFAULT NULL;
        """)


def downgrade():
    pass

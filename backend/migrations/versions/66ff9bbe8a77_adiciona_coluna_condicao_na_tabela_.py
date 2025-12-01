"""adiciona coluna condicao na tabela switches

Revision ID: 66ff9bbe8a77
Revises: 649e318cb76d
Create Date: 2025-11-28 19:39:34.374591

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '66ff9bbe8a77'
down_revision = '649e318cb76d'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        ALTER TABLE switches ADD COLUMN condicao VARCHAR(10) NOT NULL DEFAULT 'NOVO';
        """)


def downgrade():
    pass

"""Tabelas iniciais

Revision ID: 649e318cb76d
Revises: 
Create Date: 2025-11-25 22:25:20.122359

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '649e318cb76d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
            CREATE TABLE users (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                username VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB 
            DEFAULT CHARSET=utf8mb4 
            COLLATE=utf8mb4_unicode_ci;
        """)

    op.execute("""
            CREATE TABLE switches (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                patrimonio VARCHAR(50) NOT NULL UNIQUE,
                marca VARCHAR(50) NOT NULL,
                modelo VARCHAR(50) NOT NULL,
                serial_number VARCHAR(100),
                ip_address VARCHAR(45) UNIQUE,
                localizacao VARCHAR(100),
                status ENUM('ATIVO', 'MANUTENCAO', 'DESATIVADO') DEFAULT 'ATIVO',
                created_by CHAR(36) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                CONSTRAINT fk_switches_created_by 
                    FOREIGN KEY (created_by) REFERENCES users(id)
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """)

    op.execute("""
            CREATE TABLE access_logs (
                id CHAR(36) NOT NULL DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                action_type ENUM('LOGIN', 'LOGOUT') NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                CONSTRAINT fk_access_logs_users 
                    FOREIGN KEY (user_id) REFERENCES users(id) 
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """)


def downgrade():
    op.execute("DROP TABLE IF EXISTS access_logs;")
    op.execute("DROP TABLE IF EXISTS switches;")
    op.execute("DROP TABLE IF EXISTS users;")

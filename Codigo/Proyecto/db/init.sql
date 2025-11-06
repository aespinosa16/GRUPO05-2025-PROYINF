
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  contrasena_hash TEXT NOT NULL,
  numero TEXT,
  nombre TEXT,
  dos_pasos_habilitado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE UNIQUE INDEX IF NOT EXISTS ux_usuarios_email_lower ON usuarios (lower(email));


CREATE OR REPLACE FUNCTION trg_set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.actualizado_en = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON usuarios;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION trg_set_updated_at();

CREATE TABLE IF NOT EXISTS codigos_2fa (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  codigo CHAR(6) NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_codigos2fa_lookup
  ON codigos_2fa (usuario_id, codigo, usado);

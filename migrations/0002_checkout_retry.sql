ALTER TABLE chicago_reservations
  ADD COLUMN IF NOT EXISTS checkout_key uuid UNIQUE,
  ADD COLUMN IF NOT EXISTS request_hash text,
  ADD COLUMN IF NOT EXISTS amount_cents integer;
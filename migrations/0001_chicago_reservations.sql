-- Applied to the development database after task merge. Replit Publish
-- propagates this schema to its managed production database before deployment.
CREATE TABLE IF NOT EXISTS chicago_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_intent_id text UNIQUE,
  items jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
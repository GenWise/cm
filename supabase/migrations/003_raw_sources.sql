-- Raw Sources table for tracking content origins
-- Feedback sheets, videos, surveys, WhatsApp messages, emails, etc.

CREATE TABLE raw_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link to program
  program_id UUID REFERENCES programs(id),

  -- Source classification
  source_type TEXT NOT NULL CHECK (source_type IN (
    'feedback_sheet',
    'video_recording',
    'session_recording',
    'whatsapp_message',
    'email_thread',
    'survey_response',
    'social_media',
    'other'
  )),

  -- Details
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT,                    -- Google Sheet, Drive link, etc.
  source_id TEXT,                     -- External ID (sheet ID, message ID, etc.)

  -- Metadata
  date_collected DATE,
  collected_by TEXT,

  -- Workflow
  status TEXT DEFAULT 'raw' CHECK (status IN ('raw', 'reviewing', 'curated', 'published', 'archived')),

  -- For extracted testimonials
  testimonial_count INTEGER DEFAULT 0,
  best_quotes JSONB DEFAULT '[]',     -- Array of {quote, author, school, rating}

  -- Notes
  notes TEXT,
  tags JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering
CREATE INDEX raw_sources_program_idx ON raw_sources(program_id);
CREATE INDEX raw_sources_status_idx ON raw_sources(status);
CREATE INDEX raw_sources_type_idx ON raw_sources(source_type);

-- Trigger for updated_at
CREATE TRIGGER raw_sources_updated_at
  BEFORE UPDATE ON raw_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE raw_sources IS 'Track raw content sources for testimonials, clips, and marketing materials';
COMMENT ON COLUMN raw_sources.best_quotes IS 'Curated quotes extracted from this source, JSON array';

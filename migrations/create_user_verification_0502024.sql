CREATE TABLE public.user_verification (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.user(id),
    unique_string TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

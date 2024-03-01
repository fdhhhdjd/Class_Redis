INSERT INTO public."user" (id, username, email, password, status, created_at, updated_at)
SELECT
    generate_series(10, 10009) AS id,
    'user' || generate_series(10, 10009) AS username,
    'user' || generate_series(10, 10009) || '@example.com' AS email,
    'password' || generate_series(10, 10009) AS password,
    floor(random() * 100) AS status,
    now() - interval '1 day' * floor(random() * 365) AS created_at,
    now() - interval '1 day' * floor(random() * 365) AS updated_at;

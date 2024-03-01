--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE "class-fullstack";




--
-- Drop roles
--

DROP ROLE taidev;


--
-- Roles
--

CREATE ROLE taidev;
ALTER ROLE taidev WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:QfDIoqa0D1qxM9/eJ0qRrw==$BJPZQSsIJtNoK2gBFxbTftl3GYyP3j7apzZPnXfE/rg=:l+SymSeqsryLpBXTJPSfJ+dUNB8Z3r8U9aa7TjGwihs=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: taidev
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO taidev;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: taidev
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: taidev
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: taidev
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "class-fullstack" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg120+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: class-fullstack; Type: DATABASE; Schema: -; Owner: taidev
--

CREATE DATABASE "class-fullstack" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "class-fullstack" OWNER TO taidev;

\connect -reuse-previous=on "dbname='class-fullstack'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: taidev
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO taidev;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: taidev
--

COMMENT ON SCHEMA public IS '';


--
-- Name: insert_hello_label_after_user_change(); Type: FUNCTION; Schema: public; Owner: taidev
--

CREATE FUNCTION public.insert_hello_label_after_user_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Kiểm tra sự kiện là INSERT và có cột 'username'
    IF TG_OP = 'INSERT' AND NEW.username IS NOT NULL THEN
        -- Chèn một nhãn mới với tên là 'hello create' vào bảng label
        INSERT INTO public.label (name) VALUES ('hello create');
    END IF;

    -- Kiểm tra sự kiện là UPDATE và cột 'username' thay đổi
    IF TG_OP = 'UPDATE' AND NEW.username <> OLD.username THEN
        -- Chèn một nhãn mới với tên là 'hello update' vào bảng label
        INSERT INTO public.label (name) VALUES ('hello update');
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.insert_hello_label_after_user_change() OWNER TO taidev;

--
-- Name: insert_or_update_user(character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: taidev
--

CREATE PROCEDURE public.insert_or_update_user(IN p_username character varying, IN p_email character varying, IN p_password character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Kiểm tra xem người dùng có tồn tại hay không
    IF EXISTS (SELECT 1 FROM public."user" WHERE username = p_username) THEN
        -- Nếu tồn tại, thực hiện UPDATE
        UPDATE public."user"
        SET email = p_email, password = p_password
        WHERE username = p_username;
    ELSE
        -- Nếu không tồn tại, thực hiện INSERT
        INSERT INTO public."user" (username, email, password)
        VALUES (p_username, p_email, p_password);
    END IF;
END;
$$;


ALTER PROCEDURE public.insert_or_update_user(IN p_username character varying, IN p_email character varying, IN p_password character varying) OWNER TO taidev;

--
-- Name: view_label_data(); Type: FUNCTION; Schema: public; Owner: taidev
--

CREATE FUNCTION public.view_label_data() RETURNS TABLE(label_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT name
    FROM public.label;
END;
$$;


ALTER FUNCTION public.view_label_data() OWNER TO taidev;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: label; Type: TABLE; Schema: public; Owner: taidev
--

CREATE TABLE public.label (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.label OWNER TO taidev;

--
-- Name: label_id_seq; Type: SEQUENCE; Schema: public; Owner: taidev
--

CREATE SEQUENCE public.label_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.label_id_seq OWNER TO taidev;

--
-- Name: label_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taidev
--

ALTER SEQUENCE public.label_id_seq OWNED BY public.label.id;


--
-- Name: todo_list; Type: TABLE; Schema: public; Owner: taidev
--

CREATE TABLE public.todo_list (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.todo_list OWNER TO taidev;

--
-- Name: todo_list_id_seq; Type: SEQUENCE; Schema: public; Owner: taidev
--

CREATE SEQUENCE public.todo_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todo_list_id_seq OWNER TO taidev;

--
-- Name: todo_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taidev
--

ALTER SEQUENCE public.todo_list_id_seq OWNED BY public.todo_list.id;


--
-- Name: todo_list_label; Type: TABLE; Schema: public; Owner: taidev
--

CREATE TABLE public.todo_list_label (
    todo_list_id integer NOT NULL,
    label_id integer NOT NULL,
    due_date date
);


ALTER TABLE public.todo_list_label OWNER TO taidev;

--
-- Name: user; Type: TABLE; Schema: public; Owner: taidev
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    status smallint DEFAULT 10,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO taidev;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: taidev
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO taidev;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taidev
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: label id; Type: DEFAULT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.label ALTER COLUMN id SET DEFAULT nextval('public.label_id_seq'::regclass);


--
-- Name: todo_list id; Type: DEFAULT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.todo_list ALTER COLUMN id SET DEFAULT nextval('public.todo_list_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: label; Type: TABLE DATA; Schema: public; Owner: taidev
--

COPY public.label (id, name, created_at, updated_at) FROM stdin;
1	hello	2024-01-04 04:46:27.636599	2024-01-04 04:46:27.636599
2	hello	2024-01-04 04:48:35.687558	2024-01-04 04:48:35.687558
3	hello update	2024-01-04 04:53:37.714473	2024-01-04 04:53:37.714473
4	hello create	2024-01-04 04:55:03.747616	2024-01-04 04:55:03.747616
5	hello create	2024-01-04 07:05:07.177812	2024-01-04 07:05:07.177812
\.


--
-- Data for Name: todo_list; Type: TABLE DATA; Schema: public; Owner: taidev
--

COPY public.todo_list (id, title, user_id, created_at, updated_at) FROM stdin;
1	Work	1	2024-01-03 16:56:35.114859	2024-01-03 16:56:35.114859
2	Personal	2	2024-01-03 16:56:35.114859	2024-01-03 16:56:35.114859
3	Shopping	1	2024-01-03 16:56:35.114859	2024-01-03 16:56:35.114859
\.


--
-- Data for Name: todo_list_label; Type: TABLE DATA; Schema: public; Owner: taidev
--

COPY public.todo_list_label (todo_list_id, label_id, due_date) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: taidev
--

COPY public."user" (id, username, email, password, status, created_at, updated_at) FROM stdin;
1	Tai\n	user1@email.com	password1	10	2024-01-03 16:20:54.969231	2024-01-03 16:20:54.969231
2	Hào	user2@email.com	password2	10	2024-01-03 16:20:54.969231	2024-01-03 16:20:54.969231
3	Tấn	user3@email.com	password3	10	2024-01-03 16:20:54.969231	2024-01-03 16:20:54.969231
5	user5	user5@email.com	password5	10	2024-01-04 04:48:35.687558	2024-01-04 04:48:35.687558
4	user442	user4@email.com	password4	10	2024-01-04 04:46:27.636599	2024-01-04 04:46:27.636599
6	user5	user5@email.com	password5	10	2024-01-04 04:55:03.747616	2024-01-04 04:55:03.747616
7	user6	user6111@email.com	password6	10	2024-01-04 07:05:07.177812	2024-01-04 07:05:07.177812
\.


--
-- Name: label_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taidev
--

SELECT pg_catalog.setval('public.label_id_seq', 5, true);


--
-- Name: todo_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taidev
--

SELECT pg_catalog.setval('public.todo_list_id_seq', 3, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taidev
--

SELECT pg_catalog.setval('public.user_id_seq', 7, true);


--
-- Name: label label_pkey; Type: CONSTRAINT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_pkey PRIMARY KEY (id);


--
-- Name: todo_list_label todo_list_label_pkey; Type: CONSTRAINT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.todo_list_label
    ADD CONSTRAINT todo_list_label_pkey PRIMARY KEY (todo_list_id, label_id);


--
-- Name: todo_list todo_list_pkey; Type: CONSTRAINT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.todo_list
    ADD CONSTRAINT todo_list_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user trg_insert_hello_label_after_user_change; Type: TRIGGER; Schema: public; Owner: taidev
--

CREATE TRIGGER trg_insert_hello_label_after_user_change AFTER INSERT OR UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.insert_hello_label_after_user_change();


--
-- Name: todo_list_label todo_list_label_label_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.todo_list_label
    ADD CONSTRAINT todo_list_label_label_id_fkey FOREIGN KEY (label_id) REFERENCES public.label(id);


--
-- Name: todo_list_label todo_list_label_todo_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.todo_list_label
    ADD CONSTRAINT todo_list_label_todo_list_id_fkey FOREIGN KEY (todo_list_id) REFERENCES public.todo_list(id);


--
-- Name: todo_list todo_list_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taidev
--

ALTER TABLE ONLY public.todo_list
    ADD CONSTRAINT todo_list_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: taidev
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--


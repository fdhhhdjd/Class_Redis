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
  	-- Code logic into 
	IF TG_OP='INSERT' AND NEW.username IS NOT NULL THEN 
		-- Started 
			INSERT INTO public.label (name) VALUES ('hello create');
	END IF;
	
	IF TG_OP = 'UPDATE' AND NEW.username <> OLD.username THEN
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

CREATE FUNCTION public.view_label_data() RETURNS TABLE(taidev character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
	--- logic
	RETURN QUERY SELECT name FROM public.label;
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
6	hello create	2024-01-05 15:36:39.590747	2024-01-05 15:36:39.590747
7	hello update	2024-01-05 15:37:52.429364	2024-01-05 15:37:52.429364
8	hello update	2024-01-05 15:40:52.66935	2024-01-05 15:40:52.66935
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
5	user5	user5@email.com	password5	10	2024-01-04 04:48:35.687558	2024-01-04 04:48:35.687558
7	user6	user6111@email.com	password6	10	2024-01-04 07:05:07.177812	2024-01-04 07:05:07.177812
3	Tấn	user3@email.com	password3	20	2024-01-03 16:20:54.969231	2024-01-03 16:20:54.969231
4	user442	user4@email.com	password4	30	2024-01-04 04:46:27.636599	2024-01-04 04:46:27.636599
8	aaa	aa@email.com	passworda	10	2024-01-05 15:36:39.590747	2024-01-05 15:36:39.590747
6	bababa1q	user5@email.com	password5	40	2024-01-04 04:55:03.747616	2024-01-04 04:55:03.747616
\.


--
-- Name: label_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taidev
--

SELECT pg_catalog.setval('public.label_id_seq', 8, true);


--
-- Name: todo_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taidev
--

SELECT pg_catalog.setval('public.todo_list_id_seq', 3, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taidev
--

SELECT pg_catalog.setval('public.user_id_seq', 8, true);


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


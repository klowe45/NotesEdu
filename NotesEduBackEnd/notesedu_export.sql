--
-- PostgreSQL database dump
--

\restrict Lb8iZ1PlqxH13UAUb2eZpktVBcrBGNayFVjvPFpHPsZnkBBJUioT5zVflaAENyI

-- Dumped from database version 18.0 (Postgres.app)
-- Dumped by pg_dump version 18.0 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: kenneth
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    appeared boolean NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.attendance OWNER TO kenneth;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: kenneth
--

CREATE SEQUENCE public.attendance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_id_seq OWNER TO kenneth;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kenneth
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: clients; Type: TABLE; Schema: public; Owner: kenneth
--

CREATE TABLE public.clients (
    id integer CONSTRAINT students_id_not_null NOT NULL,
    first_name character varying(100) CONSTRAINT students_first_name_not_null NOT NULL,
    middle_name character varying(100),
    last_name character varying(100) CONSTRAINT students_last_name_not_null NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clients OWNER TO kenneth;

--
-- Name: dailies; Type: TABLE; Schema: public; Owner: kenneth
--

CREATE TABLE public.dailies (
    id integer NOT NULL,
    client_id integer CONSTRAINT dailies_student_id_not_null NOT NULL,
    teacher_id integer,
    title character varying(150) NOT NULL,
    body text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dailies OWNER TO kenneth;

--
-- Name: dailies_id_seq; Type: SEQUENCE; Schema: public; Owner: kenneth
--

CREATE SEQUENCE public.dailies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dailies_id_seq OWNER TO kenneth;

--
-- Name: dailies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kenneth
--

ALTER SEQUENCE public.dailies_id_seq OWNED BY public.dailies.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: kenneth
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    first_name character varying DEFAULT 'NULL'::character varying NOT NULL,
    last_name character varying DEFAULT 'NULL'::character varying NOT NULL,
    date date NOT NULL,
    filename character varying DEFAULT 'NULL'::character varying NOT NULL,
    file_type character varying DEFAULT 'NULL'::character varying NOT NULL,
    author character varying DEFAULT 'NULL'::character varying NOT NULL,
    file_path text DEFAULT 'NULL'::text NOT NULL
);


ALTER TABLE public.documents OWNER TO kenneth;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: kenneth
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO kenneth;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kenneth
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: kenneth
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    client_id integer CONSTRAINT notes_student_id_not_null NOT NULL,
    teacher_id integer,
    title character varying(150) NOT NULL,
    body text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notes OWNER TO kenneth;

--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: kenneth
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notes_id_seq OWNER TO kenneth;

--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kenneth
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: kenneth
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO kenneth;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kenneth
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.clients.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: kenneth
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password character varying(250)
);


ALTER TABLE public.teachers OWNER TO kenneth;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: kenneth
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_id_seq OWNER TO kenneth;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kenneth
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: clients id; Type: DEFAULT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.clients ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: dailies id; Type: DEFAULT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.dailies ALTER COLUMN id SET DEFAULT nextval('public.dailies_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: kenneth
--

COPY public.attendance (id, first_name, last_name, appeared, date) FROM stdin;
6	Ruby	Test	t	2025-11-04
5	Amber	Test	t	2025-11-04
4	Test	Student	t	2025-11-04
3	Test	Student	t	2025-11-04
8	Emily	Gill	t	2025-11-04
7	Lee	Long	t	2025-11-04
9	Test	Student	t	2025-11-05
10	Amber	Test	t	2025-11-05
11	Ruby	Test	t	2025-11-05
12	Lee	Long	t	2025-11-05
13	Test	Student	t	2025-11-13
14	Amber	Test	t	2025-11-13
15	Ruby	Test	t	2025-11-13
16	Test	Student	t	2025-11-29
17	Amber	Test	t	2025-11-29
18	Ruby	Test	t	2025-11-29
19	Lee	Long	t	2025-11-29
20	Emily	Gill	t	2025-11-29
21	Austin	Paul	t	2025-11-29
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: kenneth
--

COPY public.clients (id, first_name, middle_name, last_name, created_at) FROM stdin;
1	Test	C	Student	2025-10-04 11:02:04.044518
2	Amber	L	Test	2025-10-04 11:13:44.118458
3	Ruby	T	Test	2025-10-04 11:17:57.261241
4	Lee	E	Long	2025-10-05 14:50:50.611137
5	Emily	\N	Gill	2025-10-07 12:51:48.423362
6	Austin	B	Paul	2025-11-23 16:27:06.475065
\.


--
-- Data for Name: dailies; Type: TABLE DATA; Schema: public; Owner: kenneth
--

COPY public.dailies (id, client_id, teacher_id, title, body, created_at) FROM stdin;
1	1	4	Money Management	Made food and counted money.	2025-11-21 16:48:03.612586
5	3	4	Meal Prep	Made food and counted money.	2025-11-21 16:48:03.612437
2	2	4	Meal Prep	Made food and counted money.	2025-11-21 16:48:03.612011
3	1	4	Meal Prep	Made food and counted money.	2025-11-21 16:48:03.612637
22	4	4	Money Management	counted money. cooked fish.	2025-11-29 12:00:55.072053
27	6	4	Meal Prep	counted money. cooked fish.	2025-11-29 12:00:55.090543
23	2	4	Money Management	counted money. cooked fish.	2025-11-29 12:00:55.071153
25	1	4	Meal Prep	counted money. cooked fish.	2025-11-29 12:00:55.08878
28	5	4	Meal Prep	counted money. cooked fish.	2025-11-29 12:00:55.091347
21	1	4	Money Management	counted money. cooked fish.	2025-11-29 12:00:55.071588
26	6	4	Money Management	counted money. cooked fish.	2025-11-29 12:00:55.089553
6	2	4	Money Management	Made food and counted money.	2025-11-21 16:48:03.612536
24	5	4	Money Management	counted money. cooked fish.	2025-11-29 12:00:55.071813
19	4	4	Meal Prep	counted money. cooked fish.	2025-11-29 12:00:55.072489
30	3	4	Meal Prep	counted money. cooked fish.	2025-11-29 12:00:55.091754
20	2	4	Meal Prep	counted money. cooked fish.	2025-11-29 12:00:55.071443
29	3	4	Money Management	counted money. cooked fish.	2025-11-29 12:00:55.09157
4	3	4	Money Management	Made food and counted money.	2025-11-21 16:48:03.612287
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: kenneth
--

COPY public.documents (id, first_name, last_name, date, filename, file_type, author, file_path) FROM stdin;
1	Test	Student	2025-11-05	Test Student.pages	.pages	Kenneth Lowe	/Users/kenneth/projects/NotesEdu/NotesEduBackEnd/uploads/1762382733204-773205097-Test Student.pages
2	Test	Student	2025-11-21	testDoc.pdf	.pdf	Kenneth Lowe	/Users/kenneth/projects/NotesEdu/NotesEduBackEnd/uploads/1763767285252-768104909-testDoc.pdf
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: kenneth
--

COPY public.notes (id, client_id, teacher_id, title, body, created_at) FROM stdin;
28	2	4	Meal Prep	Started the day with working on counting coins. Worked on Shopping List.	2025-11-20 19:01:32.896384
27	2	4	Money Management	Started the day with working on counting coins. Worked on Shopping List.	2025-11-20 19:01:32.896164
29	5	4	Money Management	Counted coins. Made food.	2025-11-21 16:36:36.892786
34	2	4	Money Management	Counted coins. Made food.	2025-11-21 16:36:36.892616
32	1	4	Meal Prep	Counted coins. Made food.	2025-11-21 16:36:36.892523
33	4	4	Meal Prep	Counted coins. Made food.	2025-11-21 16:36:36.892373
30	4	4	Money Management	Counted coins. Made food.	2025-11-21 16:36:36.892177
31	1	4	Money Management	Counted coins. Made food.	2025-11-21 16:36:36.892711
35	2	4	Meal Prep	Counted coins. Made food.	2025-11-21 16:36:36.911561
36	5	4	Meal Prep	Counted coins. Made food.	2025-11-21 16:36:36.912033
37	3	4	Money Management	Counted coins. Made food.	2025-11-21 16:36:36.912353
38	3	4	Meal Prep	Counted coins. Made food.	2025-11-21 16:36:36.912691
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: kenneth
--

COPY public.teachers (id, first_name, last_name, email, created_at, password) FROM stdin;
1	Alice	Anderson	alice@example.com	2025-10-03 18:11:49.401427	\N
2	Brian	Baker	brian@example.com	2025-10-03 18:11:49.401427	\N
3	Amber	Test	test@yahoo.com	2025-10-04 12:06:32.642955	password
4	Kenneth	Lowe	kennethlowe45@yahoo.com	2025-11-05 08:34:20.488564	$2b$10$DysfU0dvYc4TdXNRmaiyP.Sv6EP/s0/6I0P2IXH5b/Qb2Wz7Kmome
\.


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kenneth
--

SELECT pg_catalog.setval('public.attendance_id_seq', 21, true);


--
-- Name: dailies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kenneth
--

SELECT pg_catalog.setval('public.dailies_id_seq', 30, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kenneth
--

SELECT pg_catalog.setval('public.documents_id_seq', 2, true);


--
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kenneth
--

SELECT pg_catalog.setval('public.notes_id_seq', 38, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kenneth
--

SELECT pg_catalog.setval('public.students_id_seq', 6, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kenneth
--

SELECT pg_catalog.setval('public.teachers_id_seq', 4, true);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: dailies dailies_pkey; Type: CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.dailies
    ADD CONSTRAINT dailies_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: clients students_pkey; Type: CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_email_key; Type: CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_email_key UNIQUE (email);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: idx_attendance_date; Type: INDEX; Schema: public; Owner: kenneth
--

CREATE INDEX idx_attendance_date ON public.attendance USING btree (date);


--
-- Name: idx_attendance_name; Type: INDEX; Schema: public; Owner: kenneth
--

CREATE INDEX idx_attendance_name ON public.attendance USING btree (first_name, last_name);


--
-- Name: idx_dailies_client_id; Type: INDEX; Schema: public; Owner: kenneth
--

CREATE INDEX idx_dailies_client_id ON public.dailies USING btree (client_id);


--
-- Name: idx_dailies_created_at; Type: INDEX; Schema: public; Owner: kenneth
--

CREATE INDEX idx_dailies_created_at ON public.dailies USING btree (created_at);


--
-- Name: idx_dailies_teacher_id; Type: INDEX; Schema: public; Owner: kenneth
--

CREATE INDEX idx_dailies_teacher_id ON public.dailies USING btree (teacher_id);


--
-- Name: dailies dailies_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.dailies
    ADD CONSTRAINT dailies_student_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: dailies dailies_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.dailies
    ADD CONSTRAINT dailies_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE SET NULL;


--
-- Name: notes notes_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_student_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: notes notes_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kenneth
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict Lb8iZ1PlqxH13UAUb2eZpktVBcrBGNayFVjvPFpHPsZnkBBJUioT5zVflaAENyI


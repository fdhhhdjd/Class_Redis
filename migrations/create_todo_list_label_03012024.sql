-- CREATE TABLE public.todo_list_label (
--     todo_list_id INTEGER REFERENCES public.todo_list(id),
--     label_id INTEGER REFERENCES public.label(id),
--     PRIMARY KEY (todo_list_id, label_id),
--     due_date DATE
-- );

CREATE TABLE public.todo_list_label (
    todo_list_id INTEGER REFERENCES public.todo_list(id),
    label_id INTEGER UNIQUE REFERENCES public.label(id), -- Thêm UNIQUE ở đây
    PRIMARY KEY (todo_list_id, label_id),
    due_date DATE
);


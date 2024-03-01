-- Tạo trigger function
CREATE OR REPLACE FUNCTION insert_hello_label_after_user_change()
RETURNS TRIGGER AS
$$
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
$$
LANGUAGE plpgsql;

CREATE TRIGGER trg_insert_hello_label_after_user_change
AFTER INSERT OR UPDATE
ON public."user"
FOR EACH ROW
EXECUTE FUNCTION insert_hello_label_after_user_change();

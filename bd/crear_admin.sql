-- =====================================================================
-- SCRIPT PARA CREAR USUARIO ADMIN GENERAL (Bypass Supabase Auth)
-- =====================================================================

WITH new_user AS (
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'jpuentesr@unidadbusqueda.gov.co',
    crypt('AdminMQ1C*2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  RETURNING id
)
INSERT INTO public.profiles (id, email, full_name, role, department)
SELECT 
  id, 
  'jpuentesr@unidadbusqueda.gov.co', 
  'Admin General (J. Puentes)', 
  'admin',
  'Unidad de Búsqueda'
FROM new_user;

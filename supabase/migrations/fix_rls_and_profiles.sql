-- =====================================================================
-- FIX: Crear perfil automático + insertar perfil del usuario actual
-- Ejecutar en Supabase Dashboard → SQL Editor
-- =====================================================================

-- 1. TRIGGER: Auto-crear perfil cuando se registra un usuario nuevo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'oacp_general',
    'Oficina del Alto Comisionado para la Paz'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. INSERTAR perfil para el usuario que YA existe
-- (esto inserta un perfil para TODOS los usuarios existentes que no tengan uno)
INSERT INTO public.profiles (id, email, full_name, role, department)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'oacp_general',
  'Oficina del Alto Comisionado para la Paz'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- 3. Verificar que el perfil se creó
SELECT id, email, full_name, role FROM public.profiles;

-- =====================================================================
-- ESQUEMA DE BASE DE DATOS - PROYECTO "MÁS QUE UNA CIFRA"
-- =====================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumeración para los Roles de Usuario
CREATE TYPE user_role AS ENUM ('admin', 'oacp_general');

-- 3. Tabla de Perfiles de Usuario
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'oacp_general',
    department TEXT DEFAULT 'Oficina del Alto Comisionado para la Paz',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Registros e Historias ("Más que una cifra")
CREATE TABLE IF NOT EXISTS public.registros_historias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_registro VARCHAR(50) UNIQUE NOT NULL,
    nombre_persona TEXT NOT NULL,
    edad INT,
    region VARCHAR(100) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    fecha_hecho DATE NOT NULL,
    categoria VARCHAR(100) NOT NULL, -- e.g., 'Constructor de Paz', 'Líder Social', 'Víctima de Conflicto'
    relato TEXT NOT NULL,
    foto_url TEXT,
    estado_verificacion VARCHAR(50) DEFAULT 'En Proceso', -- 'Verificado', 'En Proceso', 'Archivado'
    creado_por UUID REFERENCES public.profiles(id),
    creado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_el TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Ejemplo Simple ('todos') requerida en componentes
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) & POLÍTICAS DE ACCESO
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_historias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública para historias (Transparencia e Impacto)
CREATE POLICY "Lectura pública de historias" 
ON public.registros_historias FOR SELECT 
USING (true);

-- Política para Admin: Control total (CRUD)
CREATE POLICY "Admin Acceso Total Registros" 
ON public.registros_historias FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Política para OACP General: Inserción y Edición de sus propios registros / consulta institucional
CREATE POLICY "OACP General Inserción y Modificación" 
ON public.registros_historias FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'oacp_general')
    )
);

CREATE POLICY "OACP General Actualización" 
ON public.registros_historias FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'oacp_general')
    )
);

-- Políticas para la tabla 'todos'
CREATE POLICY "Lectura pública de todos" ON public.todos FOR SELECT USING (true);
CREATE POLICY "Inserción de todos para autenticados" ON public.todos FOR INSERT TO authenticated WITH CHECK (true);

-- =====================================================================
-- TRIGGERS Y FUNCIONES DE ACTUALIZACIÓN
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_el = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_registros_historias_modtime
BEFORE UPDATE ON public.registros_historias
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

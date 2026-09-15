-- =====================================================================
-- DATOS INICIALES (SEED) - PROYECTO "MÁS QUE UNA CIFRA"
-- =====================================================================

-- Insertar tareas iniciales en 'todos'
INSERT INTO public.todos (name, is_complete) VALUES
('Verificación de expedientes región Orinoquía', false),
('Consolidación de informes de memoria histórica OACP', true),
('Publicación del boletín trimestral Más que una cifra', false);

-- Insertar datos de prueba en 'registros_historias'
INSERT INTO public.registros_historias 
(codigo_registro, nombre_persona, edad, region, municipio, fecha_hecho, categoria, tipo_caso, relato, estado_verificacion) 
VALUES
(
    'MQUC-2026-001', 
    'María Esperanza Benítez', 
    48, 
    'Catatumbo', 
    'Tíbú', 
    '2021-05-14', 
    'Líder Social y Comunitaria', 
    'Entrega digna',
    'Promotora de proyectos comunitarios de sustitución y tejedora de paz en la vereda Caño Indio. Su vida es un legado de dignidad y organización vecinal.', 
    'Verificado'
),
(
    'MQUC-2026-002', 
    'Javier Orlando Montes', 
    32, 
    'Montes de María', 
    'San Jacinto', 
    '2019-11-03', 
    'Gestor Cultural', 
    'Reencuentro',
    'Músico gaitero que enseñó a más de 120 jóvenes el arte tradicional como alternativa de vida frente a la violencia. Su memoria permanece viva en las gaitas de la región.', 
    'Verificado'
),
(
    'MQUC-2026-003', 
    'Carmen Alicia Guanga', 
    55, 
    'Pacifico Nariñense', 
    'Tumaco', 
    '2022-02-28', 
    'Defensora del Territorio', 
    'Entrega digna',
    'Lideresa étnica comprometida con la soberanía alimentaria y la preservación de los manglares. Embajadora del diálogo constante y la reconciliación.', 
    'En Proceso'
);

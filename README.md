# Bodadyh Wedding Invitation

Invitación digital de boda para Daniela y Humberto - 01 de Febrero de 2026

## 🎉 Descripción

Una invitación de boda moderna y elegante construida con tecnologías web estáticas. Incluye:

- ✨ Diseño responsive y moderno
- 🎵 Reproductor de audio integrado
- ⏰ Contador regresivo hasta la fecha de la boda
- 📸 Galería de fotos interactiva
- 📝 Sistema de confirmación de asistencia
- 🗺️ Mapas integrados para ceremonia y recepción
- 🎊 Animaciones y efectos visuales

## 🏗️ Estructura del Proyecto

```
bodadyh-prev/
├── src/                          # Código fuente
│   ├── pages/                    # Páginas HTML
│   ├── styles/                   # Estilos CSS organizados
│   │   ├── base/                # Estilos base
│   │   ├── components/          # Componentes específicos
│   │   └── pages/               # Estilos por página
│   ├── scripts/                 # JavaScript modular
│   │   ├── core/                # Funcionalidad core
│   │   ├── components/          # Componentes JS
│   │   └── pages/               # Scripts por página
│   └── assets/                  # Assets organizados
│       ├── images/              # Imágenes por categoría
│       └── media/               # Audio y video
├── dist/                         # Archivos de distribución
├── docs/                         # Documentación
└── config/                       # Archivos de configuración
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno
- Servidor web local (opcional)

### Instalación
1. Clona el repositorio:
```bash
git clone https://github.com/username/bodadyh-wedding-invitation.git
cd bodadyh-wedding-invitation
```

2. Instala dependencias (opcional):
```bash
npm install
```

### Desarrollo Local
```bash
# Servidor de desarrollo
npm run dev

# O usando Python
python -m http.server 8000
```

### Construcción
```bash
npm run build
```

## 📱 Características

### Responsive Design
- Mobile-first approach
- Adaptable a todos los dispositivos
- Optimizado para PWA

### Componentes Principales
- **Hero Section**: Video de fondo con overlay
- **Countdown Timer**: Contador regresivo hasta la boda
- **Audio Player**: Reproductor de música de fondo
- **Image Gallery**: Galería interactiva de fotos
- **RSVP Form**: Formulario de confirmación de asistencia
- **Maps Integration**: Mapas de Google integrados

### Tecnologías Utilizadas
- HTML5 semántico
- CSS3 con variables personalizadas
- JavaScript ES6+ modular
- Supabase para base de datos
- Google Maps API
- Canvas Confetti para animaciones

## 🎨 Personalización

### Colores
Los colores se definen en `src/styles/base/variables.css`:
```css
:root {
  --color-primary: #2a2a2a;
  --color-accent: #6658d3;
  --bg-primary: #fff8f2;
  /* ... más variables */
}
```

### Configuración
La configuración principal está en `src/scripts/core/config.js`:
```javascript
const CONFIG = {
  wedding: {
    date: "2026-02-01T08:00:00",
    bride: "Daniela",
    groom: "Humberto",
    // ... más configuración
  }
};
```

## 📊 Base de Datos

El proyecto utiliza Supabase para almacenar las confirmaciones de asistencia:

### Tabla: confirmaciones
- `id`: Identificador único
- `codigo`: Código de invitación
- `nombre`: Nombre del invitado
- `asistencia`: 'si' o 'no'
- `timestamp`: Fecha y hora de confirmación

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run serve    # Servidor de producción
npm run lint     # Linter de código
npm run test     # Ejecutar tests
```

## 📝 Licencia

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.

## 👥 Contribuidores

- **Daniela** - Diseño y contenido
- **Humberto** - Desarrollo técnico

## 📞 Contacto

Para preguntas sobre la invitación, contacta a los novios:
- Email: bodadyh@example.com
- Teléfono: +52 XXX XXX XXXX

---

💕 *Hecho con amor para nuestra boda* 💕

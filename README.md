[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ADcDbJbt)

# Eventia — Plataforma de gestión de eventos

## Deploy de producción

[https://proyecto-c-seller-eventia.vercel.app/](https://proyecto-c-seller-eventia.vercel.app/)

---

## Usuarios de prueba

<!-- Completar antes de la entrega -->

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | | |
| Organizador | | |

---

## Instrucciones de uso

1. Registrarse con el usuarios de prueba organizador o administrador para acceder a la pagina de mis eventos.
2. El administrador ve un panel de administración donde tiene separados sus propios eventos y los eventos globales de todos los organizadores.

---

## Descripción del proyecto

Seller es la app del organizador de eventos. Permite gestionar eventos y hacer seguimiento de ventas desde un solo lugar.

Flujo básico: el organizador crea un evento → queda visible en su panel → cuando compradores adquieren entradas, las ventas y recaudación se reflejan en el panel de reportes.

**Organizador:**

- Crear, editar y eliminar sus propios eventos con nombre, descripción, categoría, ubicación, fecha, precio e imágenes
- Ver sus eventos en el panel "Mis Eventos" con búsqueda y filtros por nombre, categoría y fecha
- Ver reportes y estadísticas de ventas y recaudación de sus eventos

**Administrador:** 

- Ver y gestionar todos los eventos de todos los organizadores
- Ver el listado de organizadores registrados en la plataforma
- Acceder a reportes globales de toda la actividad de la plataforma
- Usar las simulaciones de buyer y payments para probar las integraciones

---

## Notas para la corrección

- **Simulaciones vs APIs reales:** las integraciones con buyer y payments están simuladas en la carpeta `/api/simulacion`. Sin embargo, la app ya incluye llamadas reales a los servicios de buyer y payments mediante variables de entorno que actualmente apuntan al deploy de esta misma app (seller). En la próxima entrega deberán apuntar a los deploys reales de cada servicio.

- **Manejo de stock y pedidos pendientes:** antes de registrar un nuevo pedido se verifican los pedidos pendientes de ese evento con más de 15 minutos de antigüedad, se los marca como cancelados y se restaura el stock correspondiente. Esto contempla el caso en que un cliente no complete el pago y payments no pueda notificar al seller, lo que dejaría entradas bloqueadas indefinidamente. Adicionalmente, un cron job diario repite esta limpieza como respaldo. Los pedidos cancelados no se eliminan para que el organizador pueda consultarlos como historial.

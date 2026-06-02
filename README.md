[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ADcDbJbt)

# Eventia — Plataforma de gestión de eventos

## Deploy de producción

[https://proyecto-c-seller-eventia.vercel.app/](https://proyecto-c-seller-eventia.vercel.app/)

---

## Usuarios de prueba

<!-- Completar antes de la entrega -->

| Rol | Email | Contraseña |
|---|---|---|
| Administrador |admin+clerk_test@iaw.com | iawuser#|
| Organizador |seller+clerk_test@iaw.com | iawuser#|

---

## Instrucciones de uso

1. Registrarse con el usuarios de prueba organizador o administrador para acceder a la pagina de mis eventos.
2. El administrador ve un panel de administración donde tiene separados sus propios eventos y los eventos globales de todos los organizadores.
3. El vendedor solo puede publicar eventos si el evento es del mismo día y faltan como máximo 1 hora para su inicio; para días anteriores no se permite la publicación.
4. Para crear o editar un evento, el stock debe ser de al menos 1 entrada y el precio debe ser mayor a 0.

---

## Descripción del proyecto

Seller es la app del organizador de eventos. Permite gestionar eventos y hacer seguimiento de ventas desde un solo lugar.

Flujo básico: el organizador crea un evento → queda visible en su panel → cuando compradores adquieren entradas, las ventas y recaudación se reflejan en el panel de reportes.

**Organizador:**

- Crear, editar y eliminar sus propios eventos con nombre, descripción, categoría, ubicación, fecha, precio e imágenes.
- Ver sus eventos en el panel "Mis Eventos" con búsqueda y filtros por nombre, categoría y fecha.
- Ver reportes y estadísticas de ventas y recaudación de sus eventos.

**Administrador:** 

- Ver y gestionar todos los eventos de todos los organizadores
- Ver el listado de organizadores registrados en la plataforma
- Acceder a reportes globales de toda la actividad de la plataforma
- Usar las simulaciones de buyer y payments para probar las integraciones

---

## Notas para la corrección

- **Simulaciones vs APIs reales y configuración externa:** las integraciones con buyer y payments están simuladas en la carpeta `/api/simulacion`. Sin embargo, la app ya incluye llamadas reales a los servicios de buyer y payments mediante variables de entorno que actualmente apuntan al deploy de esta misma app (seller). En la próxima entrega esas variables deberán apuntar a los deploys reales de cada servicio.

	Además, la `BUYER_API_KEY` se utiliza únicamente para la simulación y para poder notificar los pedidos cancelados a buyer en este entorno. Cuando las apps se integren de forma definitiva, esa variable deja de tener sentido en seller tal como está planteada ahora.

	También se configuran variables para UploadThing y para el cron job porque la app las usa para la subida de imágenes y para la limpieza programada de pedidos pendientes.

	Como decisión de diseño, `NEXT_PUBLIC_APP_ROLE` identifica que esta instancia corresponde a la app seller y permite que las apps de shipping y payments ajusten sus acciones según el rol del usuario, distinguiendo entre comprador y vendedor. 

- **Manejo de stock y pedidos pendientes:** antes de registrar un nuevo pedido se verifican los pedidos pendientes de ese evento con más de 15 minutos de antigüedad, se los marca como cancelados y se restaura el stock correspondiente. Esto contempla el caso en que un cliente no complete el pago y payments no pueda notificar al seller, lo que dejaría entradas bloqueadas indefinidamente. Adicionalmente, un cron job diario repite esta limpieza como respaldo. Los pedidos cancelados no se eliminan para que el organizador pueda consultarlos como historial.

- **Eliminación de eventos con pedidos asociados:** un evento solo se puede eliminar si no tiene pedidos vinculados. Si se permitiera borrarlo con pedidos existentes, quedarían pedidos sin `idEvento`, es decir, pedidos huérfanos sin sentido funcional. Además, ese cambio exigiría notificar y sincronizar a todas las web apps involucradas, algo que no se contempla en esta entrega. Esta restricción podría evaluarse recién en una tercera etapa.

- **Notificación de pedidos cancelados a buyer:** cuando un pedido se cancela, seller notifica a buyer con los `idPedidos` cancelados para que buyer pueda quitar esos registros de su tabla de compras. De esa forma, al comprador no le aparecen como entradas adquiridas pedidos que finalmente fueron cancelados por algún motivo. Por eso en la simulación de buyer se devuelve un JSON con `idsPedidos` cancelados.

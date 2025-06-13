# Sistema de Tooltips para Urban Street

Este directorio contiene los archivos relacionados con el sistema de tooltips de la aplicación.

## Estructura de Archivos

### JavaScript
- `/javascript/tooltips/tooltips-core.js`: Archivo principal que maneja la funcionalidad de todos los tooltips, incluyendo la guía paso a paso.

### CSS
- `/css/tooltips/tooltips-style.css`: Estilos optimizados para todos los tooltips del sistema.

## Funcionamiento

1. **Modal de Bienvenida**: Al cargar la página, se muestra primero el modal de bienvenida específico para cada categoría.

2. **Tooltips Guiados**: Solo después de cerrar el modal (con el botón "Siguiente" o "Cancelar"), se inicia la guía de tooltips.

3. **Evento de Control**: El modal emite un evento `modalWelcomeClosed` que es escuchado por el sistema de tooltips para iniciarlos.

## Características

- Tooltips responsive que se adaptan a diferentes tamaños de pantalla
- Texto que colapsa/ajusta automáticamente para evitar desbordamientos
- Posicionamiento mejorado para una mejor experiencia de usuario
- Prevención de scroll horizontal
- Ancho natural adaptado al contenido (max-width: 450px para desktop, 90vw para móvil)

## Solución de Problemas

Si los tooltips no aparecen después de cerrar el modal, verificar:
1. Que el evento `modalWelcomeClosed` se esté emitiendo correctamente
2. Que existan los elementos a los que se intenta anclar los tooltips
3. Que no haya errores en la consola de JavaScript

## Cambios Recientes

### 1. Mejora del ancho de tooltips
- Eliminado el límite rígido de `max-width: 275px` que causaba texto cortado
- Implementado un `max-width: 450px` más flexible para escritorio
- Mantenido el `max-width: 90vw` para dispositivos móviles
- Agregadas propiedades adicionales para mejorar el ajuste de texto:
  - `white-space: normal`
  - `word-wrap: break-word`
  - `box-sizing: border-box`

# Módulo de Caching

### @nest-js/cache-strategies

[![npm version](https://img.shields.io/npm/v/@nest-js/cache-strategies.svg)](https://www.npmjs.com/package/@nest-js/cache-strategies)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Proveer un sistema de caching <strong>SIMPLE</strong> con Redis como almacenamiento principal y memoria en caso de existir una conexión a redis exitosa.

## Estrategias de Caché
El módulo implementa las siguientes estrategias avanzadas:

### Cache First (cacheFirst) o también Cache-Aside
Esta estrategia prioriza la obtención de datos desde el caché, con actualización en segundo plano.

```typescript
async cacheFirst<T>(
  key: string,      // Clave única para identificar los datos en caché
  fallback: () => Promise<T>, // Función para obtener datos frescos
  ttl: number       // Tiempo de vida en segundos
): Promise<T>
```

#### Comportamiento
1. Primero intenta obtener datos del caché
2. Si hay datos en caché:
   - Retorna inmediatamente los datos cacheados
   - Ejecuta el fallback en segundo plano
   - Actualiza el caché con los nuevos datos
3. Si no hay datos en caché:
   - Ejecuta el fallback
   - Almacena el resultado en caché
   - Retorna los datos

### Only Cache (onlyCache)
Permite almacenar datos directamente en caché sin validación previa.

```typescript
async onlyCache<T>(
  key: string,  // Clave única para identificar los datos
  data: T,      // Datos a almacenar
  ttl: number   // Tiempo de vida en segundos
): Promise<T>
```

### Invalidate All (invalidateAll)
Limpia completamente el caché del sistema.

```typescript
async invalidateAll(): Promise<void>
```

Útil en escenarios como:
- Despliegues de nuevas versiones
- Actualizaciones masivas de datos
- Reinicio del estado de la aplicación

Además, el módulo incluye características base:
1. **Redis como almacenamiento principal**: Ofrece alta disponibilidad y persistencia.
2. **Memoria como fallback**: Se activa automáticamente si Redis no está disponible.
3. **TTL (Time-To-Live)**: Configurable para cada entrada de caché.
4. **Límite de items**: Evita el uso excesivo de memoria.

## Comportamiento de Fallback

Si Redis no está disponible o las variables de entorno no están configuradas:
- El sistema cambia automáticamente a almacenamiento en memoria.
- Se mantienen todas las operaciones (get/set/invalidate).
- Se emite un warning log indicando el cambio de estrategia.

## Configuración
```typescript
// app.module.ts
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [CacheModule],
})
```

## Variables de Entorno
Variables obligatorias para Redis. Si no están definidas, se usará memoria automáticamente:

```bash
REDIS_HOST=localhost  # Host de Redis
REDIS_PORT=6379      # Puerto de Redis
CACHE_TTL=60         # Tiempo de vida en segundos
CACHE_MAX_ITEMS=1000 # Máximo número de items en caché
LOGGER_LEVEL=info    # Nivel de logs (debug, info, warn, error)
```

## Uso de estrategias de caching

### Uso de Cache First
```typescript
import { CacheService } from './cache.service';

@Injectable()
export class MyService {
  constructor(private readonly cacheService: CacheService) {}

  async getUserProfile(userId: string) {
    return this.cacheService.cacheFirst(
      `user-profile-${userId}`,
      async () => {
        // Simula obtención de datos de una API o base de datos
        return await this.userApi.getProfile(userId);
      },
      3600 // TTL de 1 hora
    );
  }
}
```

### Uso de Only Cache
```typescript
import { CacheService } from './cache.service';

@Injectable()
export class ConfigService {
  constructor(private readonly cacheService: CacheService) {}

  async saveConfig(config: AppConfig) {
    return this.cacheService.onlyCache(
      'app-config',
      config,
      7200 // TTL de 2 horas
    );
  }
}
```
### Invalidar la cache por una key especifica
```typescript
import { CacheService } from './cache.service';

@Injectable()
export class MyService {
  constructor(private readonly cache: CacheService) {}
  async invalidateData(key: string) {
    await this.cache.invalidate(key);
  }
}
```

### Mejores prácticas
1. Usar prefijos para keys cuando hay múltiples servicios
2. Definir TTLs adecuados según la frecuencia de actualización
3. Implementar patrón Cache-Aside como en los ejemplos
4. Considerar invalidación masiva para actualizaciones importantes

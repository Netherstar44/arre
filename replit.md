# GestureForge 3D

Plataforma profesional de modelado 3D con control por gestos de mano en tiempo real via webcam. Toda la interfaz está en español latinoamericano.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — iniciar el servidor API (puerto dinámico)
- `pnpm --filter @workspace/gesture-forge run dev` — iniciar el frontend (puerto dinámico)
- `pnpm run typecheck` — verificación de tipos en todos los paquetes
- `pnpm run build` — typecheck + build de todos los paquetes
- `pnpm --filter @workspace/api-spec run codegen` — regenerar hooks y schemas Zod desde el spec OpenAPI

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Three.js / @react-three/fiber / @react-three/drei, @react-three/rapier
- Gestos: @mediapipe/hands + @mediapipe/camera_utils
- Estado: Zustand (sceneStore, gestureStore, uiStore)
- API: Express 5
- Validación: Zod (zod/v4), drizzle-zod
- Codegen de API: Orval (desde spec OpenAPI)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — contrato API (fuente de verdad)
- `lib/api-client-react/src/generated/` — hooks React Query generados
- `lib/api-zod/src/generated/` — schemas Zod generados
- `artifacts/gesture-forge/src/` — frontend React
  - `components/Scene/` — canvas 3D con React Three Fiber
  - `components/GestureHUD/` — overlay de gestos (webcam + landmarks)
  - `components/Editor/` — paneles laterales y toolbar
  - `components/QRModal/` — generador de códigos QR
  - `components/CommandPalette/` — paleta de comandos (Ctrl+K)
  - `store/` — stores Zustand (sceneStore, gestureStore, uiStore)
  - `hooks/useGestures.ts` — integración MediaPipe
  - `pages/Editor.tsx` — editor principal
  - `pages/AnchorViewer.tsx` — visor de anclajes QR (/anchor/:id)
- `artifacts/api-server/src/routes/anchors/` — CRUD de anclajes (persistencia JSON)
- `artifacts/api-server/src/routes/exports/` — guardar/descargar modelos exportados
- `artifacts/api-server/src/data/anchors.json` — archivo de persistencia de anclajes

## Architecture decisions

- Persistencia de anclajes vía JSON file (sin base de datos) para simplificar el despliegue.
- WebGL se inicializa con ErrorBoundary para manejar entornos sandbox donde no hay GPU.
- MediaPipe carga modelos desde CDN de jsDelivr para evitar bundling de archivos WASM grandes.
- Zustand con stores separados (scene, gesture, ui) para evitar re-renders innecesarios del loop de Three.js.
- HMR overlay de Vite desactivado para evitar que errores de WebGL bloqueen la UI en preview.

## Product

Editor de modelado 3D profesional con:
- 10 tipos de primitivas 3D (Cubo, Esfera, Cilindro, Toro, Cono, Cápsula, Tetraedro, Icosaedro, Nudo Tórico, Lathe)
- Control por gestos de mano via webcam (14 gestos de una mano + gestos bimanales)
- Editor de materiales PBR (color, rugosidad, metalness, emisivo, opacidad)
- Sistema de física con @react-three/rapier (Dinámico/Cinemático/Fijo)
- Sistema de anclajes QR (crear, guardar, compartir vistas de escena 3D)
- Exportación a GLTF/OBJ/STL
- Paleta de comandos (Ctrl+K)
- Atajos de teclado estilo Blender

## User preferences

- Todo en español latinoamericano
- Estética Industrial Oscuro (#0a0a0f fondo, #00f0ff cyan, #ff3366 rosa)
- Sin emojis en la UI
- Fuentes: JetBrains Mono (código/labels) + Syne (títulos)

## Gotchas

- WebGL no funciona en el iframe sandbox de Replit (preview). Funciona correctamente al desplegar o abrir en una pestaña real del navegador.
- Después de cambiar `lib/api-spec/openapi.yaml`, siempre ejecutar `pnpm --filter @workspace/api-spec run codegen` antes de usar los tipos generados.
- El servidor API no usa base de datos; los anclajes se persisten en `artifacts/api-server/src/data/anchors.json`.

## Pointers

- Ver skill `pnpm-workspace` para estructura del monorepo, TypeScript y detalles de paquetes

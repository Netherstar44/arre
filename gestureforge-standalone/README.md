# GestureForge 3D

Plataforma profesional de modelado 3D con control por gestos de mano en tiempo real via webcam.

## Instalación

```bash
npm install
# o
pnpm install
```

## Desarrollo local

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## Deploy en Vercel

### Opción 1 — Vercel CLI

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones. En "Build Command" pon `npm run build` y en "Output Directory" pon `dist`.

### Opción 2 — GitHub + Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Ve a https://vercel.com/new y conecta tu repositorio.
3. Vercel detecta automáticamente Vite — haz clic en "Deploy".

El archivo `vercel.json` ya está configurado para que todas las rutas (`/`, `/anchor`) funcionen correctamente como SPA.

## Cómo funcionan los códigos QR

Los anclajes QR codifican **toda la escena 3D directamente en la URL** (base64). Esto significa que:

- El enlace QR funciona en **cualquier dispositivo** al escanearlo — no se necesita un servidor.
- La URL incluye la geometría, materiales y posición de todos los objetos.
- El visor en `/anchor?s=...` decodifica la escena y la renderiza en 3D.
- Pulsa "Modo AR" en el visor para superponer el modelo sobre la cámara trasera.

## Persistencia

- La escena 3D se guarda automáticamente en `localStorage` del navegador.
- Al recargar la página, los objetos aparecen tal como los dejaste.
- Los anclajes QR también se guardan en `localStorage` para acceso rápido.

## Stack

- React 19 + Vite 7
- Three.js / @react-three/fiber / @react-three/drei
- Gestos: @mediapipe/hands + @mediapipe/camera_utils
- Estado: Zustand (con persist)
- Estilos: Tailwind CSS v4 + shadcn/ui
- Routing: wouter

## Estructura

```
src/
  components/
    Editor/       # Paneles laterales, toolbar, bottom panel
    GestureHUD/   # Overlay de gestos y webcam
    QRModal/      # Modal de anclaje QR
    Scene/        # Canvas 3D con React Three Fiber
  hooks/          # useGestures (MediaPipe integration)
  pages/
    Editor.tsx    # Página principal del editor
    AnchorViewer.tsx # Visor de anclajes (decodifica desde URL)
  store/
    sceneStore.ts   # Objetos 3D + persistencia localStorage
    anchorStore.ts  # Anclajes QR + codificación de URL
    gestureStore.ts # Estado de gestos y modo AR/VR
    uiStore.ts      # Estado de la UI (tabs, modales, etc.)
```

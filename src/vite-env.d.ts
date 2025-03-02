/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACK_URL;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

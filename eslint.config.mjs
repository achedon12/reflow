import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// Configuration à plat directe, sans `FlatCompat` : eslint-config-next 16
// exporte déjà des tableaux à plat, et les faire repasser par la couche de
// compatibilité fait échouer ESLint sur « Converting circular structure to
// JSON ».
const eslintConfig = [
    ...coreWebVitals,
    ...typescript,
    { ignores: ['.next/**', 'out/**', 'node_modules/**'] },
];

export default eslintConfig;

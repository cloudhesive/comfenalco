module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  collectCoverage: true, // Habilita la recolección de cobertura
  coverageThreshold: {
    global: {
      branches: 90, // Cobertura mínima en ramas condicionales
      functions: 90, // Cobertura mínima en funciones
      lines: 90, // Cobertura mínima en líneas de código
      statements: 90, // Cobertura mínima en declaraciones
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/", // Ignorar dependencias externas
    "/dist/", // Ignorar archivos compilados
    "/build/", // Ignorar archivos de construcción
    "/coverage/", // Evitar analizar su propia cobertura
    "/tests/", // Evitar contar archivos de pruebas en la cobertura
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}", // Solo recolectar cobertura de archivos TypeScript dentro de src
    "!src/**/*.d.ts", // Ignorar archivos de definición de tipos
  ],
  coverageReporters: ["json", "lcov", "text", "clover"], // Tipos de reporte de cobertura
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/build/"], // Ignorar pruebas en estas rutas
  verbose: true, // Muestra detalles sobre las pruebas ejecutadas
  testTimeout: 10000, // Configura un tiempo de espera de 10s por prueba
  maxWorkers: "50%", // Usa el 50% de los núcleos de la CPU para las pruebas
};

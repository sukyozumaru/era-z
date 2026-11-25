/* El laboratorio usa su propio espacio de guardado, incluso con todos los sistemas desactivados. */
const DEV = (() => {
 const query = new URLSearchParams(location.search);
 const enabled = query.get('dev') === '1';
 const feature = name => enabled && query.get(name) !== '0';
 const bossOptions = new Set(enabled ? (query.get('mamut') || 'ondas,avisos,expuesto').split(',') : []);
 return {
  enabled, progression: feature('progresion'), director: feature('director'), portal: feature('portal'),
  boss: option => bossOptions.has(option),
  saveKey: enabled ? 'eraz-dev1-save' : 'arcane1',
  statsKey: enabled ? 'eraz-dev1-stats' : 'erazStats',
  version: '0.2.0-dev.1',
 };
})();

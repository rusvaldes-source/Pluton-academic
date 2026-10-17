/* B58 — métricas dinámicas, aisladas. No toca producción. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PlutonB58CatalogMetrics = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function summarize(catalog) {
    const courses = Array.isArray(catalog) ? catalog : Array.isArray(catalog?.courses) ? catalog.courses : null;
    if (!courses) throw new TypeError('Catálogo sin lista de cursos');
    const codes = new Set();
    let lessons = 0;
    for (const course of courses) {
      if (!course || typeof course.code !== 'string' || !course.code.trim()) throw new Error('Curso sin código');
      if (codes.has(course.code)) throw new Error('Código duplicado: ' + course.code);
      codes.add(course.code);
      if (course.lessons != null && !Array.isArray(course.lessons)) throw new Error('Lecciones inválidas: ' + course.code);
      lessons += (course.lessons || []).length;
    }
    return { courses: courses.length, lessons, courseCodes: [...codes] };
  }
  function labels(metrics, language) {
    const n = metrics.courses;
    if (!Number.isSafeInteger(n) || n < 0) throw new Error('Cantidad inválida');
    return language === 'en' ? `${n} courses in the catalog` : `${n} cursos en el catálogo`;
  }
  return { summarize, labels };
});

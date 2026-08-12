(async () => {
  const m = await import('jspdf');
  console.log('default:', typeof m.default);
  console.log('jsPDF:', typeof m.jsPDF);
})();

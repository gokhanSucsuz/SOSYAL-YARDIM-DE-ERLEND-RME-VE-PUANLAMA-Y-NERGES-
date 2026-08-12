(async () => {
  const m = await import('html2canvas');
  console.log('default:', typeof m.default);
  console.log('html2canvas:', typeof m.html2canvas);
})();

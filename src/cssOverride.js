// export const removeWebpackCSS = () => {
//   // Remove webpack injected styles
//   const styles = document.querySelectorAll('style');
//   styles.forEach(style => {
//     if (style.textContent.includes('webpack://')) {
//       console.log('Removing webpack style:', style);
//       style.remove();
//     }
//   });

//   // Remove webpack injected links
//   const links = document.querySelectorAll('link[rel="stylesheet"]');
//   links.forEach(link => {
//     if (link.href.includes('webpack://')) {
//       console.log('Removing webpack link:', link);
//       link.remove();
//     }
//   });
// };

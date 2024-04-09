export function pageToTop(options: any = { top: 0, behavior: 'smooth' }) {
  window.document.getElementsByClassName('page-container')?.[0].scrollTo(options);
}

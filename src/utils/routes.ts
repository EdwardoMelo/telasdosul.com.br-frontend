/** Rotas de cadastro/edição de produto — layout sem navbar principal */
export function isProductFormRoute(pathname: string): boolean {
  if (pathname === "/produtos/new") return true;
  return /^\/produtos\/\d+\/edit$/.test(pathname);
}

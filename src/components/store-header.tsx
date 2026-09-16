import { Link } from "@tanstack/react-router";
import { Menu, Search, UserRound } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/condirico-logo.png.asset.json";
import { Button } from "@/components/button";
import { CartDrawer } from "@/components/cart-drawer";

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["#inicio", "Inicio"], ["#productos", "Productos"], ["#categorias", "Categorías"], ["#ofertas", "Ofertas"], ["#contacto", "Contacto"],
  ];
  return <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-5 lg:px-8"><Link to="/" aria-label="CondiRico, inicio"><img src={logoAsset.url} alt="CondiRico" className="h-14 w-40 object-contain" /></Link><nav className="ml-4 hidden items-center gap-7 text-sm font-semibold lg:flex">{links.map(([href, label]) => <a key={href} className={href === "#inicio" ? "text-primary" : ""} href={href}>{label}</a>)}</nav><form action="/" method="get" className="ml-auto hidden h-10 w-full max-w-xs items-center gap-2 rounded-full bg-muted px-4 md:flex"><Search size={17} className="text-muted-foreground"/><input name="q" className="w-full bg-transparent text-sm outline-none" placeholder="Buscar productos..." aria-label="Buscar productos" /></form><Button variant="icon" className="hidden h-10 w-10 p-0 sm:inline-flex" aria-label="Mi cuenta"><UserRound size={20}/></Button><CartDrawer/><Button variant="icon" className="h-10 w-10 p-0 lg:hidden" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><Menu size={22}/></Button></div>{menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-4 font-bold">{links.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</div></nav>}</header>;
}
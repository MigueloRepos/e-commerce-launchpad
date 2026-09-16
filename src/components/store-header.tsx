import { Link } from "@tanstack/react-router";
import { Menu, Search, UserRound } from "lucide-react";
import logoAsset from "@/assets/condirico-logo.png.asset.json";
import { Button } from "@/components/button";
import { CartDrawer } from "@/components/cart-drawer";

export function StoreHeader() {
  return <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-5 lg:px-8"><Link to="/" aria-label="CondiRico, inicio"><img src={logoAsset.url} alt="CondiRico" className="h-14 w-40 object-contain" /></Link><nav className="ml-4 hidden items-center gap-7 text-sm font-semibold lg:flex"><a className="text-primary" href="#inicio">Inicio</a><a href="#productos">Productos</a><a href="#categorias">Categorías</a><a href="#ofertas">Ofertas</a><a href="#contacto">Contacto</a></nav><label className="ml-auto hidden h-10 w-full max-w-xs items-center gap-2 rounded-full bg-muted px-4 md:flex"><Search size={17} className="text-muted-foreground"/><input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar productos..." aria-label="Buscar productos" /></label><Button variant="icon" className="hidden h-10 w-10 p-0 sm:inline-flex" aria-label="Mi cuenta"><UserRound size={20}/></Button><CartDrawer/><Button variant="icon" className="h-10 w-10 p-0 lg:hidden" aria-label="Abrir menú"><Menu size={22}/></Button></div></header>;
}
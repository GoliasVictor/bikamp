import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";
import { Outlet, NavLink } from "react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}
import { useAuth } from "../hooks/useAuth";

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "BIKAMP	",
  },
  menu = [
    { url: "/"            , title : "Home"   },
    { url: "/bicicletas"  , title : "Bicicletas"},
    { url: "/emprestimos" , title : "Empréstimos"},
    { url: "/mantenedores", title : "Mantenedores"},
    { url: "/simulador"   , title : "Simulador Bicicletário"},
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  const { user } = useAuth()!;
  return (
    <section className="py-4">
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <NavLink to={logo.url} className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tighter">
                {logo.title}
              </span>
            </NavLink>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-4">
            {
              user?.user_login ? <>
                <span className="text-gray-500 flex inline-flex items-center justify-center gap-2"> Usuário: {user.user_login} </span>
                <Button asChild variant="outline">
                    <NavLink to={auth.login.url}>Sair</NavLink>
                </Button>

              </> : 
                <Button asChild variant="outline">
                    <NavLink to={auth.login.url}>{auth.login.title}</NavLink>
                </Button>
            }
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mx-6">
            {/* Logo */}
            <NavLink to={logo.url} className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tighter">
                {logo.title}
              </span>
            </NavLink>
            <Sheet>
              <SheetTrigger >
                <Button asChild variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <NavLink to={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8" alt={logo.alt} />
                    </NavLink>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                <div className="flex flex-col gap-3">
                    {
                      user?.user_login ? <>
                        <span className="text-gray-500">Usuário: {user.user_login} </span>
                        <Button asChild variant="outline">
                            <NavLink to={auth.login.url}>Sair</NavLink>
                        </Button>
   
                      </> : 
                        <Button asChild variant="outline">
                            <NavLink to={auth.login.url}>{auth.login.title}</NavLink>
                        </Button>
                    }
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavLink
        to={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <NavLink key={item.title} to={item.url} className="text-md font-semibold">
      {item.title}
    </NavLink>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <NavLink
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      to={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </NavLink>
  );
};

export default Navbar1;


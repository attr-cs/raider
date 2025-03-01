import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { authState, userState } from '@/store/atoms';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

function Navbar() {
  const auth = useRecoilValue(authState);
  const user = useRecoilValue(userState);
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/generate" className="text-sm font-medium hover:text-primary">
        Generate
      </Link>
      <Link to="/gallery" className="text-sm font-medium hover:text-primary">
        Gallery
      </Link>
      <Link to="/pricing" className="text-sm font-medium hover:text-primary">
        Pricing
      </Link>
    </>
  );

  const UserMenu = () => (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">
        {user.credits} credits
      </span>
      <Sheet>
        <SheetTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-left"
            >
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50  bg-transparent backdrop-blur">
    {/* <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/192.png" alt="Raider" className="h-8 w-8" />
            {/* <span className="font-bold hidden sm:inline">Raider</span> */}
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
          </div>
        </div>

        {/* <div className="flex items-center gap-4">
          {auth.isAuthenticated ? (
            <>
              <UserMenu />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <div className="flex flex-col gap-4 mt-6">
                    <NavLinks />
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <div className="flex flex-col gap-4 mt-6">
                    <NavLinks />
                    <Link 
                      to="/signin" 
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div> */}
      </div>
    </nav>
  );
}

export default Navbar;

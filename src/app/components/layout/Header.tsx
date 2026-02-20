import { Menu, Search, Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import genwiseLogo from '../../../assets/2d95a1f9e548cad80a9c83e4c0aaf7579ed40ad5.png';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-4 gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={genwiseLogo} 
              alt="GenWise" 
              className="h-8 w-auto object-contain"
            />
            <span className="font-semibold text-lg hidden sm:inline text-gray-800">
              Content Manager
            </span>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search videos, clips, posts..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <Button variant="default" size="sm" className="gap-2" asChild>
              <DropdownMenuTrigger>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </DropdownMenuTrigger>
            </Button>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/videos/new">Add Video</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/posts/new">New Post</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/ideas/new">Post Idea</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <Button variant="ghost" size="icon" asChild>
              <DropdownMenuTrigger>
                <User className="w-5 h-5" />
              </DropdownMenuTrigger>
            </Button>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
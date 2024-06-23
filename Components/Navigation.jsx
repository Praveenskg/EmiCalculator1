import AppLogo from "./AppLogo";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  return (
    <div className="fixed top-0 z-50 w-full dark:bg-gray-900 shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <AppLogo />
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navigation;

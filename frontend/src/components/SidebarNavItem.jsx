import { NavLink } from "react-router";

const SidebarNavItem = ({ to, icon, children, closeSidebar, onItemClick }) => {
  const handleClick = (e) => {
    closeSidebar?.();
    if (onItemClick?.(e)) {
      console.log("Logout clicked");
    }
  };
  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
          isActive
            ? "bg-blue-100 text-primary"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
};

export default SidebarNavItem;

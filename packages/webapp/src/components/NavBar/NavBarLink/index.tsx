import { Link } from 'react-router-dom';
import classes from './NavBarLink.module.css';

interface NavBarLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const NavBarLink: React.FC<NavBarLinkProps> = props => {
  const { to, children, className } = props;
  const isExternal = /^https?:\/\//.test(to);

  if (isExternal) {
    return (
      <a
        href={to}
        className={`${classes.navBarLink} ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={`${classes.navBarLink} ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavBarLink;

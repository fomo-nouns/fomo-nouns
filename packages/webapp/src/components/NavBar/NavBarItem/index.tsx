import classes from './NavBarItem.module.css';
import { ReactNode } from 'react';

interface NavBarItemProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

const NavBarItem: React.FC<NavBarItemProps> = props => {
  const { onClick, children, className } = props;
  return (
    <div className={`${classes.navBarItem} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default NavBarItem;

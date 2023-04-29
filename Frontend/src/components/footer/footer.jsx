import React from 'react';
import './footer.css';

const Footer = () => {
  return (

<footer className="footer_bottom" data-testid="footer">
        
        <p>&copy; {new Date().getFullYear()} Aurora Inc.</p>
      </footer>
    
 

  );
};

export default Footer;
import * as React from 'react';
import { Link as RouterLink, LinkProps } from 'react-router';

// Wrapper for react-router Link that properly forwards refs
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    return <RouterLink {...props} ref={ref} />;
  }
);

Link.displayName = 'Link';

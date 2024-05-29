import React from 'react';
import NextTopLoader from 'nextjs-toploader';

const TopLoader = () => {
  return (
    <NextTopLoader
      color="linear-gradient(to right, rgb(249, 168, 212), rgb(216, 180, 254), rgb(129, 140, 248))"
      height={5}
      easing="ease"
      speed={2000}
    />
  );
};

export default TopLoader;

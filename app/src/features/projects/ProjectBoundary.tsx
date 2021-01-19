import React, { useEffect } from 'react';

const ProjectBoundary: React.FC = () => {
  const initMap = () => {
    console.log('Here is a map');
  };

  useEffect(() => {
    initMap(); 
  });

  return (
    <div>Testing</div>
  );

};

export default ProjectBoundary;
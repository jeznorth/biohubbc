import ProjectsRouter from 'features/projects/ProjectsRouter';
import AuthLayout from 'layouts/AuthLayout';
import PublicLayout from 'layouts/PublicLayout';
import AccessDenied from 'pages/403/AccessDenied';
import NotFoundPage from 'pages/404/NotFoundPage';
import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import AppRoute from 'utils/AppRoute';

const AppRouter: React.FC = () => {
  const getTitle = (page: string) => {
    return `BioHub - ${page}`;
  };

  return (
    <Switch>
      <Redirect exact from="/" to="/projects" />
      <AppRoute
        path="/forbidden"
        title={getTitle('Forbidden')}
        component={AccessDenied}
        layout={PublicLayout}></AppRoute>
      <AppRoute
        path="/page-not-found"
        title={getTitle('Page Not Found')}
        component={NotFoundPage}
        layout={PublicLayout}></AppRoute>
      <AppRoute
        protected
        path="/projects"
        component={ProjectsRouter}
        layout={AuthLayout}
        title={getTitle('Projects')}
      />
      {/* Temporary map route for demo */}
      <AppRoute protected path="/map" component={ProjectsRouter} layout={AuthLayout} title={getTitle('Map')} />
      <AppRoute title="*" path="*" component={() => <Redirect to="/page-not-found" />} />
    </Switch>
  );
};

export default AppRouter;

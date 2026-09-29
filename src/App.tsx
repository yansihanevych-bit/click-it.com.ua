import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { DEFAULT_LANG } from '@/config/languages';
import { LangLayout } from '@/components/Layout/LangLayout';
import HomePage from '@/pages/Home/HomePage';

// Home is eager (LCP); inner pages are split into their own chunks.
const ServicesPage = lazy(() => import('@/pages/Services/ServicesPage'));
const ServicePage = lazy(() => import('@/pages/Services/ServicePage'));
const ProjectsPage = lazy(() => import('@/pages/Projects/ProjectsPage'));
const ProjectPage = lazy(() => import('@/pages/Projects/ProjectPage'));
const AboutPage = lazy(() => import('@/pages/About/AboutPage'));
const BlogPage = lazy(() => import('@/pages/Blog/BlogPage'));
const ContactsPage = lazy(() => import('@/pages/Contacts/ContactsPage'));
const PrivacyPage = lazy(() => import('@/pages/Privacy/PrivacyPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Navigate to={`/${DEFAULT_LANG}/`} replace />} />
        <Route path=":lang" element={<LangLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServicePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

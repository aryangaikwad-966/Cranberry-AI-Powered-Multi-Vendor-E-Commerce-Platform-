import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AIChatbot from '../ai/Chatbot';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white" data-testid="main-layout">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default MainLayout;

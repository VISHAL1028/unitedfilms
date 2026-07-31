import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Masthead }           from '@/components/home/Masthead';
import { HeroEditorial }      from '@/components/home/HeroEditorial';
import { ServicesEditorial }  from '@/components/home/ServicesEditorial';
import { EquipmentEditorial } from '@/components/home/EquipmentEditorial';
import { AboutEditorial }     from '@/components/home/AboutEditorial';
import { ContactEditorial }   from '@/components/home/ContactEditorial';
import { FooterEditorial }    from '@/components/home/FooterEditorial';

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [hash]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Masthead />
      <main>
        <HeroEditorial />
        <ServicesEditorial />
        <EquipmentEditorial />
        <AboutEditorial />
        <ContactEditorial />
      </main>
      <FooterEditorial />
    </div>
  );
};

export default Index;

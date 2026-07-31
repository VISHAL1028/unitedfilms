import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { services } from './serviceData';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ServicePage = () => {
  const { serviceId } = useParams();
  const service = services.find((item) => item.id === serviceId);

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <p className="text-gray-400 mb-6">
            The service you are looking for does not exist.
          </p>
          <Link to="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="relative h-screen w-full overflow-hidden">
        {service.videoPath && (
          <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
            <source src={service.videoPath} type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-10 max-w-7xl mx-auto pt-20">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <span className="inline-block px-4 py-1 rounded-full text-sm font-medium border border-white/30 mb-6 w-fit text-gray-300">
            {service.tagline}
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            {service.title}
          </h1>

          <p className="max-w-2xl text-gray-300 text-lg md:text-xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>

      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">WHAT'S INCLUDED</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">{service.longDescription}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {service.features?.map((item, index) => (
            <div
              key={item}
              className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between transition-transform duration-300 hover:scale-[1.03]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-white/50">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 leading-tight">{item}</h3>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Professional {item.toLowerCase()} services for high-end productions.
              </p>
            </div>
          ))}
        </div>
      </section>

      {service.splitVideo && (
        <section className="grid lg:grid-cols-2 items-center gap-16 px-6 md:px-10 py-24 max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent rounded-2xl blur-xl" />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="relative rounded-2xl shadow-2xl object-cover aspect-square md:aspect-4/3 w-full border border-white/10"
            >
              <source src={service.splitVideo} type="video/mp4" />
            </video>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {service.splitSectionTitle}
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {service.splitSectionText}
            </p>
            <ul className="space-y-4 mb-10">
              {service.details?.map((detail) => (
                <li key={detail} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-gray-300 font-medium">{detail}</span>
                </li>
              ))}
            </ul>
            <a href="/#contact">
              <button className="px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                Get a Quote
              </button>
            </a>
          </div>
        </section>
      )}

      {service.parallaxVideo && (
        <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover opacity-40"
          >
            <source src={service.parallaxVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
          <div className="relative z-10 text-center px-4">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{service.parallaxTitle}</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {service.parallaxText}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ServicePage;

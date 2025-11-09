import { Text, Button, Badge } from "@stellar/design-system";
import React from "react";

export const Hero: React.FC = () => {
  return (
   <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Text as="h1"  size="xs" className="text-white font-bold">
                  StellarPay
                </Text>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Características
                </a>
                <a href="#benefits" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Beneficios
                </a>
                <a href="#contact" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Contacto
                </a>
                <Button variant="primary"  size="sm" >
                  Empezar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="mb-6">
              <div  className="mb-4">
                <Badge  size="sm">
                  Revolucionando los Pagos Globales
                </Badge>
              </div>
            </div>
            <Text as="h1" size="xl"  className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Pagos Globales{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Instantáneos
              </span>{' '}
              con Stellar
            </Text>
            <Text as="p" size="md"  className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforma tu negocio con la red Stellar: transferencias internacionales rápidas, 
              seguras y de bajo costo. La tecnología blockchain que conecta el mundo financiero.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="primary"  className="px-8 py-3">
                Comenzar Ahora
              </Button>
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Text as="h2" size="sm" className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Por qué elegir Stellar para pagos?
            </Text>
            <Text as="p" size="md" className="text-lg text-slate-300 max-w-2xl mx-auto">
              Descubre las ventajas que hacen de Stellar la red ideal para pagos globales
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/50 border-slate-700 p-6 text-center hover:bg-slate-900/70 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <Text as="h3" size="md" className="text-white font-semibold mb-2">
                Velocidad Ultra
              </Text>
              <Text as="p" size="md" className="text-slate-400">
                Transacciones en 2-5 segundos. Sin esperas, sin demoras.
              </Text>
            </div>

            <div className="bg-slate-900/50 border-slate-700 p-6 text-center hover:bg-slate-900/70 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <Text as="h3" size="md" className="text-white font-semibold mb-2">
                Costos Bajos
              </Text>
              <Text as="p" size="md" className="text-slate-400">
                Tarifa de red desde $0.0001. Reduce dramáticamente los costos.
              </Text>
            </div>

            <div className="bg-slate-900/50 border-slate-700 p-6 text-center hover:bg-slate-900/70 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <Text as="h3" size="md" className="text-white font-semibold mb-2">
                Alcance Global
              </Text>
              <Text as="p" size="md" className="text-slate-400">
                180+ países soportados. Conecta mercados globales instantáneamente.
              </Text>
            </div>

            <div className="bg-slate-900/50 border-slate-700 p-6 text-center hover:bg-slate-900/70 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <Text as="h3" size="md" className="text-white font-semibold mb-2">
                Seguridad Máxima
              </Text>
              <Text as="p" size="md" className="text-slate-400">
                Cifrado avanzado y consenso federado. Protege tus fondos.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Text as="h2" size="md" className="text-3xl md:text-4xl font-bold text-white mb-6">
                Beneficios para tu Negocio
              </Text>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Text as="h3" size="md" className="text-white font-semibold mb-2">
                      Para Merchants
                    </Text>
                    <Text as="p" size="md" className="text-slate-300">
                      Acepta pagos internacionales sin comisiones altas. Mejora la experiencia del cliente con transacciones instantáneas.
                    </Text>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Text as="h3" size="md" className="text-white font-semibold mb-2">
                      Para Usuarios
                    </Text>
                    <Text as="p" size="md" className="text-slate-300">
                      Envía dinero a cualquier parte del mundo en segundos. Tarifas ultra bajas y transparencia total.
                    </Text>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <Text as="h3" size="md" className="text-white font-semibold mb-2">
                      Para Desarrolladores
                    </Text>
                    <Text as="p" size="md" className="text-slate-300">
                      API robusta y documentación completa. Integra pagos Stellar en tu aplicación en minutos.
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
              <Text as="h3" size="md" className="text-white font-bold mb-4">
                Estadísticas de la Red
              </Text>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Text as="p" size="md" className="text-2xl font-bold text-blue-400">
                    50M+
                  </Text>
                  <Text as="p" size="md" className="text-slate-300">
                    Transacciones Procesadas
                  </Text>
                </div>
                <div className="text-center">
                  <Text as="p" size="md" className="text-2xl font-bold text-green-400">
                    99.9%
                  </Text>
                  <Text as="p" size="md" className="text-slate-300">
                    Uptime
                  </Text>
                </div>
                <div className="text-center">
                  <Text as="p" size="md" className="text-2xl font-bold text-purple-400">
                    180+
                  </Text>
                  <Text as="p" size="md" className="text-slate-300">
                    Países Soportados
                  </Text>
                </div>
                <div className="text-center">
                  <Text as="p" size="md" className="text-2xl font-bold text-orange-400">
                    $0.0001
                  </Text>
                  <Text as="p" size="md" className="text-slate-300">
                    Tarifa Promedio
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <Text as="h2" size="md" className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para transformar tus pagos?
          </Text>
          <Text as="p" size="md" className="text-xl text-blue-100 mb-8">
            Únete a miles de negocios que ya están usando Stellar para pagos globales instantáneos
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="primary" className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-3">
              Empezar Gratis
            </Button>
            <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10 px-8 py-3">
              Hablar con Ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Text as="h3" size="md" className="text-white font-bold">
                StellarPay
              </Text>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Soporte
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <Text as="p"size="md"  className="text-slate-400">
              © 2025 StellarPay. Todos los derechos reservados.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  );
};

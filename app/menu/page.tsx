import type { Metadata } from "next"
import Image from "next/image"
import MenuCard from "@/components/menu-card"
import MainNav from "@/components/main-nav"

export const metadata: Metadata = {
  title: "Menú - ReservaSabores",
  description: "Descubre nuestra selección de platos en ReservaSabores",
}

const menuCategories = [
  {
    id: "entradas",
    name: "Entradas",
    items: [
      {
        id: "1",
        name: "Carpaccio de Res",
        description: "Finas láminas de res con aceite de oliva, limón, alcaparras y queso parmesano",
        price: 12.5,
        image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=2592&auto=format&fit=crop",
      },
      {
        id: "2",
        name: "Bruschetta Mediterránea",
        description: "Pan rústico tostado con tomate, albahaca, ajo y aceite de oliva virgen extra",
        price: 9.9,
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=2574&auto=format&fit=crop",
      },
      {
        id: "3",
        name: "Tabla de Quesos Artesanales",
        description: "Selección de quesos locales e importados con frutos secos y mermelada casera",
        price: 18.5,
        image: "https://images.unsplash.com/photo-1631379578550-7038263db699?q=80&w=2532&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "principales",
    name: "Platos Principales",
    items: [
      {
        id: "4",
        name: "Risotto de Setas Silvestres",
        description: "Cremoso risotto con variedad de setas silvestres, queso parmesano y aceite de trufa",
        price: 22.9,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2669&auto=format&fit=crop",
      },
      {
        id: "5",
        name: "Salmón a la Parrilla",
        description: "Filete de salmón a la parrilla con salsa de cítricos, acompañado de vegetales de temporada",
        price: 24.5,
        image: "https://images.unsplash.com/photo-1560717845-968823efbee1?q=80&w=2670&auto=format&fit=crop",
      },
      {
        id: "6",
        name: "Filete Mignon",
        description: "Tierno filete de res con reducción de vino tinto, puré de papas trufado y espárragos",
        price: 32.9,
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2670&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "postres",
    name: "Postres",
    items: [
      {
        id: "7",
        name: "Tiramisú Artesanal",
        description: "Clásico postre italiano elaborado con café, mascarpone y cacao de la mejor calidad",
        price: 9.5,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=2574&auto=format&fit=crop",
      },
      {
        id: "8",
        name: "Crème Brûlée",
        description: "Suave crema de vainilla con costra de azúcar caramelizada",
        price: 8.9,
        image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?q=80&w=2670&auto=format&fit=crop",
      },
      {
        id: "9",
        name: "Coulant de Chocolate",
        description: "Bizcocho de chocolate con centro líquido, acompañado de helado de vainilla",
        price: 10.5,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2670&auto=format&fit=crop",
      },
    ],
  },
]

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <MainNav />

      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2670&auto=format&fit=crop"
              alt="Restaurant background"
              fill
              className="object-cover brightness-[0.2]"
              priority
            />
          </div>
          <div className="container px-4 mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Nuestra Carta</h1>
              <p className="max-w-xl mt-4 mx-auto text-lg text-white/70">
                Descubre una experiencia gastronómica única con nuestra selección de platos preparados con los
                ingredientes más frescos y técnicas culinarias refinadas.
              </p>
            </div>
          </div>
        </section>

        {menuCategories.map((category) => (
          <section key={category.id} className="py-16 bg-dark" id={category.id}>
            <div className="container px-4 mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{category.name}</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <MenuCard
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    image={item.image}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>

      <footer className="py-8 bg-black/30">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">ReservaSabores</h3>
              <p className="mt-2 text-sm text-white/70">La mejor experiencia gastronómica de la ciudad.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Horario</h3>
              <p className="mt-2 text-sm text-white/70">
                Lunes a Viernes: 12:00 - 23:00
                <br />
                Sábados y Domingos: 11:00 - 00:00
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contacto</h3>
              <p className="mt-2 text-sm text-white/70">
                Calle Principal 123
                <br />
                Tel: (123) 456-7890
                <br />
                info@reservasabores.com
              </p>
            </div>
          </div>
          <div className="mt-8 text-sm text-center text-white/50">
            © {new Date().getFullYear()} ReservaSabores. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}


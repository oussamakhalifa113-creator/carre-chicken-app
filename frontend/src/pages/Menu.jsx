import "./Menu.css";
import { menuData } from "../data/menuData";
import ProductCard from "../components/ProductCard";
import BlurText from "../components/BlurText";

function isMenuAvailable(item) {
  if (item.name !== "Menu Étudiant") return true;

  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  return day >= 1 && day <= 5 && hour >= 10 && hour < 14;
}

function Menu() {
  return (
    <main className="menu-page">
      <header className="menu-header">
        <p>Commande en ligne</p>

        <BlurText
          text="Menu Carré Chicken"
          className="menu-title"
          delay={130}
          direction="top"
        />
      </header>

      <section className="categories-bar">
        {menuData.map((cat) => (
          <a key={cat.category} href={`#${cat.category.replaceAll(" ", "-")}`}>
            {cat.category}
          </a>
        ))}
      </section>

      <div className="menu-container">
        {menuData.map((category) => (
          <section
            key={category.category}
            id={category.category.replaceAll(" ", "-")}
            className="category-section"
          >
            <h2>{category.category}</h2>

            <div className="product-grid">
              {category.items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  available={isMenuAvailable(item)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default Menu;

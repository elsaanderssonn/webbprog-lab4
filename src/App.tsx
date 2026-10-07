import { useState } from "react"; // kan hålla ett tillstånd som förändras under tid (varukorgens innehåll)

import { inventory } from "@/inventory"; // importerar alla ingredienser och dess info
import { Salad } from "@/salad"; // importerar Salad-klassen för att skapa Salad-objekt och beräkna dess pris och egenskaper

// Link: när användaren klickar på en link hamanr den på en ny sida, navigering
// Outlet: Platsen där den valda sidan visas
import { Link, Outlet } from "react-router";
import {
  NavigationMenu,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// skapar array med 3 färdiga salladsobjekt i varukorgen när programmet startar
const initialCart = [
  new Salad()
    .add("Sallad", inventory["Sallad"])
    .add("Kycklingfilé", inventory["Kycklingfilé"])
    .add("Bacon", inventory["Bacon"])
    .add("Krutonger", inventory["Krutonger"])
    .add("Parmesan", inventory["Parmesan"])
    .add("Ceasardressing", inventory["Ceasardressing"])
    .add("Gurka", inventory["Gurka"]),
  new Salad()
    .add("Sallad + Quinoa", inventory["Sallad + Quinoa"])
    .add("Kycklingfilé", inventory["Kycklingfilé"])
    .add("Cashewnötter", inventory["Cashewnötter"])
    .add("Fetaost", inventory["Fetaost"])
    .add("Sojabönor", inventory["Sojabönor"])
    .add("Ceasardressing", inventory["Ceasardressing"]),
  new Salad()
    .add("Sallad", inventory["Sallad"])
    .add("Marinerad bönmix", inventory["Marinerad bönmix"])
    .add("Avocado", inventory["Avocado"])
    .add("Lime", inventory["Lime"])
    .add("Örtvinägrett", inventory["Örtvinägrett"]),
];

function App() {
  // <Salad[]>: får endast vara objekt av typen Salad i arrayen
  // cart: aktuell lista med sallader i varukorgen
  // setCart: funktion för att ändra något i varukorgen
  const [cart, setCart] = useState<Salad[]>(initialCart); // lägg in initialCart med de 3 färdiga salladerna i cart
    // tar emot nytt Salad-objetk från Compose-Salad (spread operator som kopierar över alla sallader till ett nytt objekt och adderar nya salladen)
  const addSalad = (salad: Salad) => {
    setCart((prevCart) => [...prevCart, salad]);
  };
  // Outlet är platsen där rätt undersida visas beroende på URL, istället för att sidor visas samtidigt
  // Skapa en meny med menyval (NavigationMenu, -List)
  // Link to, nav..Trigger....: Gör länk till sidan genom knapp med samma stil som de andra knapparna
  // Outlet context: undersidorna kan hämta denna information
  return (
    <div className="grid max-w-4xl grid-rows-1 gap-4">
      <h1 className="text-center text-3xl font-bold md:w-4xl">
        Min egen salladsbar
      </h1>

      <NavigationMenu>
        <NavigationMenuList>
        <Link to="/" className={navigationMenuTriggerStyle()}>
        Hem
        </Link>
        </NavigationMenuList>

        <NavigationMenuList>
        <Link to="/compose-salad" className={navigationMenuTriggerStyle()}>
        Skapa sallad
        </Link>
        </NavigationMenuList>

        <NavigationMenuList>
        <Link to="/view-cart" className={navigationMenuTriggerStyle()}>
        Varukorgen
        </Link>
        </NavigationMenuList>

      </NavigationMenu>

      <Outlet context={{inventory, cart, addSalad}}/>
    </div>
  );
}

export default App;

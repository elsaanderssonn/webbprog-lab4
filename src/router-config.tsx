// Route Provider:läser av webbadressen i webbläsaren & bestämmer vilken React-komponent som ska visas på skärmen
// "Om URLen är:..., visa denhär sidan"
import App from "./App"; // app är som skalet/layouten för hela sidan
import ComposeSalad from "./compose-salad"; // Menyvalet "Skapa sallad"
import ViewCart from "./view-cart"; // Menyvalet "Varukorgen"
import type { Salad } from "./salad";
import { // välkomst-sidan byggs upp längre och behöver dessa komponenter
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./components/ui/alert";
import {
  createBrowserRouter,
  type RouteObject,
  useParams,
  useOutletContext,
} from "react-router";

// Konfigurationslista: lista över vilka sidor som finns och hur de ska visas
const routerConfig: RouteObject[] = [
  {
    Component: App, // sätter app som huvudram/layout för sidan
    children: [ // undersidorna som ska visas i app
      {
        index: true, // när vi står på startsidan (startsidans URL)
        Component: Home, // ska Home visas i app
      },
      {
        path: "/compose-salad",
        Component: ComposeSalad, // Skickar datan genom Outlet istället för att skicka den direkt som props till undersidorna
      },
      {
        path: "/view-cart",
        Component: ViewCart, // Skickar datan genom Outlet istället för att skicka den direkt som props till undersidorna
          children: [
            {
              path: "new/:uuid", // under-route där uuid används för att identifiera den nya salladen
              Component: NewSaladInfobox, // visar information om den nya salladen
            },
          ],
      },
      {
        path: "*", // Alla URLer som inte matchar
        Component: PageNotFound,
      }
    ],
  },
];

// Skapar och returnerar komponenten Hoem som visas på startsidan  
function Home() {
  return (
    <Card className="md:w-3xl">
      <CardHeader>
        <CardTitle>Välkommen till min salladsbar</CardTitle>
        <CardDescription>
          Här kan du komponera och beställa sallader.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// skapa felsida, dyker upp om användaren skriver in webbadress som inte finns i router-konfigurationen
function PageNotFound() {
  return <h2>Sidan kunde inte hittas</h2>;
}

// Visar meddelande när en ny sallad har lagts till
function NewSaladInfobox() {
  const { uuid } = useParams();
  const { cart } = useOutletContext<{ cart: Salad[] }>();

  const saladExists = cart.some((salad) => salad.uuid === uuid); // kontrollerar att uuid i URL:en tillhör en sallad i varukorgen

  if (!saladExists) {
    return <p>Felaktig url.</p>;
  }

  return (
    <Alert className="mb-4">
      <AlertTitle>En ny sallad har lagts till i</AlertTitle>
      <AlertDescription>
        Salladen har lagts till i varukorgen.
      </AlertDescription>
    </Alert>
  );
}
// Konfigurationslistan byggs till en riktig router som kan läsa webbläsarens URL och bestämma vilken sida som ska visas
const router = createBrowserRouter(routerConfig);

// exportera routern
export default router;

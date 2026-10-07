import { Button } from "./components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import type { Salad } from "./salad";
import { CircleCheckIcon } from "lucide-react";
import { Outlet, useOutletContext, useParams} from "react-router"; // Gör att ViewCart kan hämta data från Outlet, dvs kan visa vilka sallader som ligger i varukorgen
import { Badge } from "./components/ui/badge"; // 

function ViewCart(){
  const { cart } = useOutletContext<{ cart: Salad[] } > (); // hämtar datan från Outlet-Context och plockar ut cart
  const { uuid } = useParams(); // hämtar uuid för den nya salladen från URL:en
  const totalPrice = cart.reduce((sum, salad) => sum + salad.price(), 0); // räknar ut totalpris, går igenom varje salad, anropar dess price-metoder
  return (
    <>
      <Card className="w-full p-3">
        {cardHead}
        <CardContent>
         <Outlet context={{ cart }} /> {/* skickar cart vidare till child-routen NewSaladInfobox */}
          <Table>
            {tableHead}
            <TableBody>
              {cart.map((salad) => { //går igenom varje salad i cart och skapar ny tabellrad
                const saladInfo = salad.info(); //anropa saladens info-metod för att checka pref
                const isNew = salad.uuid === uuid; // true om salladens uuid är samma som uuid i URL:en
              return (
              <TableRow key={salad.uuid}> 

                <TableCell className="font-normal"> 
                  {/*Object.keys hämtar lista med alla ingrediensnamn i salad.ingredients och sätter ihop till en sträng */}
                  {Object.keys(salad.ingredients).join(", ")}
                  {isNew && <Badge className="ml-2">Ny</Badge>}
                </TableCell>

                <TableCell>
                  <div>{saladInfo.vegan && <CircleCheckIcon className="m-auto text-primary" />}</div>
                </TableCell>
   
                <TableCell>
                  <div>{saladInfo.lactose && <CircleCheckIcon className="m-auto text-primary" />}</div>
                </TableCell>

                <TableCell>
                  <div>{saladInfo.gluten && <CircleCheckIcon className="m-auto text-primary" />}</div>
                </TableCell>

                <TableCell className="text-right font-normal tabular-nums">
                  {salad.price()} kr
                </TableCell>
              </TableRow>
              );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Totalt</TableCell>
                <TableCell className="text-right tabular-nums">
                  {totalPrice} kr
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

/*
 * static content, rendered when the file is loaded.
 */
const orderButton = (
  <AlertDialog>
    <AlertDialogTrigger render={<Button>Skicka beställningen</Button>} />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Under utveckling</AlertDialogTitle>
        <AlertDialogDescription>
          Denna funktion implementeras under labb 4.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
const tableHead = (
  <TableHeader>
    <TableRow>
      <TableHead className="font-semibold">Ingredienser</TableHead>
      <TableHead className="text-center font-semibold">Vegan</TableHead>
      <TableHead className="text-center font-semibold">Lactos</TableHead>
      <TableHead className="text-center font-semibold">Gluten</TableHead>
      <TableHead className="text-right font-semibold">Price</TableHead>
    </TableRow>
  </TableHeader>
);
const cardHead = (
  <CardHeader>
    <CardTitle>Varukorgen</CardTitle>
    <CardDescription>Här listas alla sallader du skapat.</CardDescription>
    <CardAction>{orderButton}</CardAction>
  </CardHeader>
);
export default ViewCart;

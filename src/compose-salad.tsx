import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IngredientType, Inventory, PartialInventory } from "@/inventory";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Salad } from "@/salad";
import { useNavigate, useOutletContext } from "react-router"; // Gör att ComposeSalad kan hämta data från Outlet, dvs kan....
import { Field, FieldError, FieldLabel } from "@/components/ui/field"; // Field täcker hela formuläret och kan markera att det är ogiltigt, FieldError: visar felmeddelande
import { CircleAlertIcon } from "lucide-react";
import { // för att kunna göra felmeddelande-rutan för extraInvalid
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type SelectOption = {
  label: string;
  value: string;
};
/**
 * @returns an array with all names of ingridients with the given @type
 */
// Hämtar alla ingrediensnamn från inventory, filtrerar fram rätt kategori och gör till alternativ-objekt
function makeOptions(
  type: IngredientType,
  inventory: Inventory
): SelectOption[] {
  return Object.keys(inventory) // hämtar alla ingrediensnamn från inventory med Object.keys()
    .filter((name) => inventory[name].type === type) //filtrerar fram utifrån rätt kategori (bas, protein, dressing)
    .map((name) => ({ // omvandlar till alternativobjekt
      value: name,
      label: `${name}, ${inventory[name].price} kr`,
    }));
}

function ComposeSalad() {
  const { inventory, addSalad } = useOutletContext<{  // hämtar ut inventory och addSalad från Outlet Context
    inventory: Inventory;
    addSalad: (salad: Salad) => void;
   }>();
  const navigate = useNavigate(); // används för att navigera till varukorgen efter att en sallad har lagts till
  const [foundation, setFoundation] = useState<SelectOption | null>(null);
  const [protein, setProtein] = useState<SelectOption | null>(null);
  const [extra, setExtra] = useState<PartialInventory>({}); // tillbehör håller ett objekt med alla i-checkade extra-ingredienser
  const [dressing, setDressing] = useState<SelectOption | null>(null);
  const [showError, setShowError] = useState(false); // visa inte fel från början, men om användaren gör ett fel, visa att det är fel

  // använder makeOptions för att varje kategori ska få en alternativ-lista
  const foundationOptions = makeOptions("foundation", inventory);
  const proteinOptions = makeOptions("protein", inventory);
  const extraOptions = makeOptions("extra", inventory);
  const dressingOptions = makeOptions("dressing", inventory);

  const extraInvalid = showError && Object.keys(extra).length < 2; // skapar boolean-variabel, säger om delen med extra ingredienser är ogiltig

  // skapar och skickar salladen
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // kontroll om det som skickas är giltigt eller ej (om bas, protein , dressing saknas eller färre än 2 extras)
    if (
      !foundation ||
      !protein ||
      Object.keys(extra).length < 2 ||
      !dressing
    ) {
      setShowError(true); // felmeddelanden får börja visas när användaren skickar formuläret
      return; // avbryt handleSumbit, skicka ingen sallad, om if-satsen va sann 
    }

    // Bygg ihop ingrediens-objektet i rätt ordning
    const ingredients: PartialInventory = {
      ...(foundation && { [foundation.value]: inventory[foundation.value] }),
      ...(protein && { [protein.value]: inventory[protein.value] }),
      ...extra,
      ...(dressing && { [dressing.value]: inventory[dressing.value] }),
    };

    // skapa salladen med alla ingredienser
    const newSalad = new Salad(ingredients);

    // Skicka färdiga salladen till App
    addSalad(newSalad);
    // Gå till varukorgen efter lyckad submit
    navigate(`/view-cart/new/${newSalad.uuid}`);

    // Nollställ formuläret
    setFoundation(null);
    setProtein(null);
    setExtra({});
    setDressing(null);
    setShowError(false); // Sätt showError till false när en korrekt sallad lagts i varukorgen så formuläret återgår till startläge
  };

  // när någon checkar i/av ett tillbehör
  const handleExtraChange = (name: string, checked: boolean) => { // tar emot ingrediensen och om den är icheckad eller inte
    setExtra((prev) => { // anropar setExtra för att uppdatera tillståndet
      const copy = { ...prev }; // skapa ny kopia av förra objektet prev med spread operator ... (skapa nytt objekt så React fattar att den behöver rita om)
      if (checked) { // om rutan är ikryssad
        copy[name] = inventory[name]; // lägg till ingrediensen i kopian med info från inventory
      } else { // om inte ikryssad/ta bort ikryssning
        delete copy[name]; // ta bort ingrediensen från kopian
      }
      return copy;
    });
  };

  return (
  <Card className="w-full p-3">
    <CardHeader>
      <CardTitle>Komponera din egen sallad</CardTitle>
      <p>Välj de ingredienser som ingår i salladen.</p>
    </CardHeader>
    <CardContent>
    {/* noValidate: använd inte webbläsarens egna standard-felmeddelanden, vi har byggt egen validering med ex. showError*/}
    <form onSubmit={handleSubmit} noValidate> 
      <SelectIngredient
        label="Välj bas"
        value={foundation}
        options={foundationOptions}
        onValueChange={setFoundation}
        showError={showError}
      ></SelectIngredient>

      <SelectIngredient
        label="Välj protein"
        value={protein}
        options={proteinOptions}
        onValueChange={setProtein}
        showError={showError}
      ></SelectIngredient>

      <div className="mb-3">
        <Label className="text-base font-semibold block mb-2">
          Välj minst två extra ingredienser
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {extraOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={!!extra[option.value]}
                onCheckedChange={(checked) =>
                  handleExtraChange(option.value, Boolean(checked))
                }
              />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </div>
        {/* Om extraInvalid är true, visa felmeddelandet*/}
        {extraInvalid && (
          <Alert variant="destructive" className="mt-4">
            <CircleAlertIcon />
            <AlertTitle>För få extra ingredienser</AlertTitle>
            <AlertDescription>
              Välj minst två extra ingredienser.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <SelectIngredient
        label="Välj dressing"
        value={dressing}
        options={dressingOptions}
        onValueChange={setDressing}
        showError={showError}
      ></SelectIngredient>

      <div className="flex justify-end mt-4">
        <Button type="submit">Lägg till i varukorgen</Button>
      </div>

    </form>
    </CardContent>
  </Card>
  );
}

type SelectIngredientType = {
  label: string;
  value: SelectOption | null;
  onValueChange: (value: SelectOption | null) => void; // tar emot valda strängen
  options: SelectOption[];
  showError : boolean;


};
function SelectIngredient({
  label,
  value,
  onValueChange,
  options,
  showError,
}: SelectIngredientType) {
  const invalid = showError && !value; // showError måste vara true & value saknas för att invalid ska bli true (invalid är ogiltigt om vi ska visa fel och när inget värde är valt)
  // Field är färdig shadcn-komponent för formulärfält, data-invalid talar om för Field om fältet är felaktigt eller inte
  return (
    <Field data-invalid={invalid}> 
    <FieldLabel htmlFor={label}>
      {label}
      {/*En * visas efter labeln för att visa att den är obligatorisk */}
      <span aria-hidden="true">*</span>
    </FieldLabel>
      <Select
        id={label}
        // SelectTrigger: kontrollen får info om att den är ogiltig när invalid == true
        name={label}
        value={value?.value ?? ""}
        required // Gör select-fältet obligatoriskt att fylla i innan formuläret räknas som giltigt
        onValueChange={(selectedName)=>{
          const found = options.find((opt) => opt.value === selectedName) || null;
          onValueChange(found);
        }}
      > 
        <SelectTrigger aria-invalid={invalid} className="w-sm"> 
          {/* Ta fram hela etiketten (Pasta, 10 kr) istället för bara värdet */}
          <SelectValue placeholder="gör ett val">
            {value ? value.label : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Felmeddelande som visas när ett Select-Field är ogiltigt*/}
      {invalid && <FieldError>Gör ett val.</FieldError>} 
    </Field>
  );
}

export default ComposeSalad;

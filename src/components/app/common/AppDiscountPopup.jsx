import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AppDiscountPopup = ({ offers }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <CircleHelp size={16} className="text-red-500 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-72">
        {offers?.map((offer, index) => {
          const sentence =
            offer?.discount_type === "inr"
              ? `Rs. ${offer.discount_amt} is off ${
                  offer.min_qty
                    ? `on purchase of ${offer.min_qty}`
                    : `on every purchase`
                }`
              : `${offer.discount_amt}% discount is available ${
                  offer.min_qty
                    ? `on purchase of ${offer.min_qty}`
                    : `on every purchase`
                }`;

          return (
            <div className="border-b text-sm tracking-wider text-muted-foreground pb-2">
              {sentence}
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
export default AppDiscountPopup;

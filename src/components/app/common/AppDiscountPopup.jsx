import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleHelp } from "lucide-react";
import { nanoid } from "nanoid";

const AppDiscountPopup = ({ offers }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <CircleHelp size={16} className="text-red-500 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
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
            <div
              key={nanoid()}
              className={`${
                offers.length > 1 && "border-b pb-2"
              } text-sm tracking-wider text-card-foreground/80 flex flex-row justify-start items-start gap-2`}
            >
              <div className="">#</div>
              <div className="">{sentence}</div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};
export default AppDiscountPopup;

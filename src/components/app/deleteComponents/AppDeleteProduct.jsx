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
} from "@/components/ui/alert-dialog";
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import showError from "@/utils/showError";
import showSuccess from "@/utils/showSuccess";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

const AppDeleteProduct = ({ deleteFromTable, deleteId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const warningMsg = deleteFromTable ? (
    <>
      <span>Product will be permanently deleted.</span>
      <span>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita,
        quaerat.
      </span>
    </>
  ) : (
    <>
      <span>Product will be deactivated.</span>
      <span>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga, illo!
      </span>
    </>
  );

  const handleDelete = async () => {
    setIsLoading(true);

    const url = deleteFromTable
      ? `/admin/products/delete/${deleteId}`
      : `/admin/products/${deleteId}`;
    const process = deleteFromTable ? customFetch.post : customFetch.delete;

    try {
      await process(url);
      setIsLoading(false);
      dispatch(updateCounter());
      showSuccess(`Product deactivated`);
    } catch (error) {
      setIsLoading(false);
      showError(`Something went wrong!`);
      return null;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button type="button">
          <Trash2 size={14} className="text-red-500" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex-col space-y-2">
            {warningMsg}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default AppDeleteProduct;

import { AppContentWrapper, AppPageLoader, AppTextEditor } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import customFetch from "@/utils/customFetch";
import showError from "@/utils/showError";
import { useState } from "react";
import { useSelector } from "react-redux";

const AdAddEditProduct = () => {
  const { currentUser } = useSelector((store) => store.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  return (
    <AppContentWrapper>
      {isLoading && <AppPageLoader />}

      <div className="flex flex-row justify-between items-center bg-muted my-1 p-2">
        <h3 className="font-semibold text-xl tracking-widest text-muted-foreground">
          Add new product
        </h3>
      </div>
      <div className="border border-muted rounded-sm p-4 mt-3">
        <div className="flex gap-4 mb-4">
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="category"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              product category <span className="text-red-500">*</span>
            </Label>
            <select
              name="category"
              id="category"
              className="flex h-10 w-full items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <option value="">- Select -</option>
            </select>
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.category}
            </span>
          </div>
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="brand"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              product brand <span className="text-red-500">*</span>
            </Label>
            <select
              name="brand"
              id="brand"
              className="flex h-10 w-full items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <option value="">- Select -</option>
            </select>
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.brand}
            </span>
          </div>
          <div className="basis-1/3 flex flex-col justify-start items-start"></div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="name"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              product name <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Product name here"
            />
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.name}
            </span>
          </div>
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="code"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              product code
            </Label>
            <Input
              type="text"
              id="code"
              name="code"
              placeholder="Product code here (if any)"
            />
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.code}
            </span>
          </div>
          <div className="basis-1/3 flex flex-col justify-start items-start"></div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-full flex flex-col justify-start items-start">
            <Label
              htmlFor="paraOne"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              product description <span className="text-red-500">*</span>
            </Label>
            {/* <AppTextEditor /> */}
            <Textarea
              id="paraOne"
              name="paraOne"
              placeholder="Product description here"
            ></Textarea>
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="code"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              price <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="code"
              name="code"
              placeholder="Product price here"
            />
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.code}
            </span>
          </div>
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="code"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              discount
            </Label>
            <div className="flex flex-row gap-2 w-full">
              <select
                name="discountType"
                id="discountType"
                className="flex h-10 w-[100px] items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              >
                <option value={`inr`}>INR</option>
                <option value={`%`}>%</option>
              </select>
              <Input
                type="text"
                id="discountAmt"
                name="discountAmt"
                placeholder="Discount amount here (if any)"
              />
            </div>
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.code}
            </span>
          </div>
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="name"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              discounted price (non-editable)
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Auto-calculated discounted price"
              readOnly={true}
            />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="basis-1/3 flex flex-col justify-start items-start">
            <Label
              htmlFor="stock"
              className="capitalize text-muted-foreground tracking-wider mb-2"
            >
              starting stock <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="stock"
              name="stock"
              placeholder="Product price here"
            />
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.stock}
            </span>
          </div>
          <div className="basis-1/3 flex flex-col justify-start items-start"></div>
          <div className="basis-1/3 flex flex-col justify-start items-start"></div>
        </div>
      </div>
      <div className="flex gap-4 border border-muted rounded-sm p-4 mt-3"></div>
    </AppContentWrapper>
  );
};
export default AdAddEditProduct;

// ----------------------------------------------

export const loader = (store) => async () => {
  const { childCategories } = store.getState().categories;

  try {
    if (!childCategories.length) {
      const chCat = await customFetch.get(`/master/child-categories`);
      console.log(chCat);
    }
    return null;
  } catch (error) {
    console.log(error);
    showError(error?.response?.data?.errors);
    return false;
  }
};

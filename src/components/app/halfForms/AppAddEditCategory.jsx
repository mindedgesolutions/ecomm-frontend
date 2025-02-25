import { AppSubmitBtn } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setParentCategories } from "@/features/categorySlice";
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AppAddEditCategory = ({ editId, setEditId, categories }) => {
  const [form, setForm] = useState({ name: "", isParent: false, parentId: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();
  const { parentCategories } = useSelector((state) => state.categories);

  // ---------------------------------------------

  const handleChange = (e) => {
    if (e.target.name === "isParent") {
      setForm({ ...form, isParent: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
    if (e.target.name === "parentId") {
      setErrors({ ...errors, parentId: "" });
    }
  };

  // ---------------------------------------------

  const resetErrors = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------------------------------------

  const resetForm = () => {
    setForm({ ...form, name: "", isParent: false, parentId: "" });
    setErrors([]);
    setEditId(null);
  };

  // ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errorCount = 0;
    let errorBag = {};

    if (!form.name) {
      errorBag = { ...errorBag, name: "Brand name is required" };
      errorCount++;
    }
    if (form.isParent && !form.parentId) {
      errorBag = { ...errorBag, parentId: "Parent category is required" };
      errorCount++;
    }
    if (errorCount > 0) {
      setErrors(errorBag);
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, isParent: form.isParent ? true : false };
    const url = editId ? `/admin/categories/${editId}` : `/admin/categories`;
    const process = editId ? customFetch.put : customFetch.post;
    const msg = editId ? "updated" : "added";
    try {
      const response = await process(url, data);

      if (response.status === 201 || response.status === 200) {
        const parents = await customFetch.get(`/master/parent-categories`);
        dispatch(setParentCategories(parents.data));

        setForm({ name: "", isParent: false, parentId: "" });
        setEditId(null);
        dispatch(updateCounter());
        showSuccess(`Category ${msg} successfully`);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrors(error?.response?.data?.errors);
      return;
    }
  };

  // ---------------------------------------------

  useEffect(() => {
    if (editId) {
      const category = categories.find((category) => category.id === editId);
      setForm({
        name: category.name,
        isParent: category.parent_id ? true : false,
        parentId: category.parent_id,
      });
    }
  }, [editId]);

  return (
    <div className="w-full md:basis-1/3 min-h-40 border rounded-lg p-4">
      <h3 className="text-lg font-medium tracking-wider text-muted-foreground mb-4">
        {editId ? `Edit details` : `Add new category`}
      </h3>
      <Separator />
      <form onSubmit={handleSubmit} autoComplete="off" className="mt-4">
        <div className="w-full items-center space-y-1 mb-2">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-widest"
          >
            brand name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Brand name here"
            value={form.name}
            onChange={handleChange}
            onKeyUp={resetErrors}
          />
          <span className="text-red-500 text-xs tracking-wider">
            {errors?.name}
          </span>
        </div>
        <div className="w-full flex items-center space-x-2.5 my-3 mb-2">
          <input
            type="checkbox"
            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            id="isParent"
            name="isParent"
            checked={form.isParent}
            onChange={handleChange}
          />
          <Label
            htmlFor="isParent"
            className="text-muted-foreground tracking-wider font-medium"
          >
            This is NOT a parent category
          </Label>
        </div>
        {form.isParent && (
          <div className="w-full items-center space-y-1 mb-2">
            <Label
              htmlFor="parentId"
              className="capitalize text-muted-foreground tracking-widest"
            >
              parent category <span className="text-red-500">*</span>
            </Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
              id="parentId"
              name="parentId"
              value={form.parentId}
              onChange={handleChange}
            >
              <option value="">- Select -</option>
              {parentCategories?.map((category) => {
                return (
                  <option key={nanoid()} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </select>
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.parentId}
            </span>
          </div>
        )}
        <Separator />
        <div className="w-full flex flex-row justify-between items-center mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="hover:bg-inherit"
          >
            Reset
          </Button>
          <AppSubmitBtn
            text={editId ? `Update` : `Add`}
            isLoading={isLoading}
            customClass={`my-0`}
          />
        </div>
      </form>
    </div>
  );
};
export default AppAddEditCategory;

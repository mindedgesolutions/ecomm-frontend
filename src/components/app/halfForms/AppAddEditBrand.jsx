import { AppSubmitBtn } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { updateCounter } from "@/features/commonSlice";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AppAddEditBrand = ({ editId, brands, setEditId }) => {
  const [form, setForm] = useState({ name: "", desc: "" });
  const [logo, setLogo] = useState(null);
  const [dbLogo, setDbLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const dispatch = useDispatch();

  // ---------------------------------------------

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    const allowed = ["image/jpeg", "image/png", "image/jpg"];

    if (file.size > 1024 * 100) {
      setErrors({ ...errors, logo: "File size should be less than 100KB" });
      document.getElementById("logo").value = "";
      return;
    }
    if (!allowed.includes(file.type)) {
      setErrors({ ...errors, logo: "File type should be jpeg, jpg or png" });
      document.getElementById("logo").value = "";
      return;
    }
    setErrors({ ...errors, logo: "" });
    setLogo(file);
  };

  // ---------------------------------------------

  const resetErrors = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------------------------------------

  const resetForm = () => {
    setForm({ ...form, name: "" });
    setErrors([]);
    setLogo(null);
    document.getElementById("logo").value = "";
    setEditId(null);
    setDbLogo(null);
  };

  // ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      setErrors({ ...errors, name: "Brand name is required" });
      return;
    }

    const formData = new FormData(e.currentTarget);
    let data = Object.fromEntries(formData);
    data = { ...data, logo: logo || null };

    const url = editId ? `/admin/brands/update/${editId}` : `/admin/brands`;
    const msg = editId
      ? `Brand updated successfully`
      : `Brand added successfully`;

    setIsLoading(true);
    try {
      const response = await customFetch.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        showSuccess(msg);
        resetForm();
        dispatch(updateCounter());
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setErrors(error?.response?.data?.errors);
    }
  };

  // ---------------------------------------------

  useEffect(() => {
    if (editId) {
      setDbLogo(null);
      const brand = brands.find((brand) => brand.id === editId);
      const logo = import.meta.env.VITE_BASE_URL + brand.logo;
      setForm({ ...form, name: brand.name, desc: brand.desc });
      brand.logo && setDbLogo(logo);
    }
  }, [editId]);

  return (
    <div className="w-full md:basis-1/3 min-h-40 border rounded-lg p-4">
      <h3 className="text-lg font-medium tracking-wider text-muted-foreground mb-4">
        {editId ? `Edit details` : `Add new brand`}
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
        <div className="w-full items-center space-y-1 mb-2">
          <Label
            htmlFor="name"
            className="capitalize text-muted-foreground tracking-widest"
          >
            Short description
          </Label>
          <Textarea
            id="desc"
            name="desc"
            placeholder="A short description here"
            value={form.desc}
            onChange={handleChange}
            onKeyUp={resetErrors}
          ></Textarea>
          <span className="text-red-500 text-xs tracking-wider">
            {errors?.desc}
          </span>
        </div>
        <div className="w-full items-center space-y-1 mb-2">
          <Label
            htmlFor="type"
            className="capitalize text-muted-foreground tracking-widest"
          >
            brand logo
          </Label>
          <input
            type="file"
            id="logo"
            name="logo"
            className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-base file:border-1 file:bg-transparent file:text-xs file:font-light file:text-foreground md:text-xs"
            onChange={handleImgChange}
            onKeyUp={resetErrors}
          />
          <span className="text-red-500 text-xs tracking-wider">
            {errors?.logo}
          </span>
        </div>
        <div className="w-full items-center space-y-1 mb-2">
          <div className="relative flex flex-row justify-start items-start">
            <span className="w-24 h-24 border border-dashed">
              {logo || dbLogo ? (
                <img
                  src={logo ? URL.createObjectURL(logo) : dbLogo}
                  alt="preview"
                  className="w-24 h-24 object-fill"
                />
              ) : (
                <span className="text-muted-foreground text-xs tracking-wider"></span>
              )}
            </span>
            <Trash2
              className="text-red-500 ml-2 absolute bottom-1 left-24 cursor-pointer"
              size={18}
              onClick={() => {
                setLogo(null);
                document.getElementById("logo").value = "";
              }}
            />
          </div>
        </div>
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
export default AppAddEditBrand;

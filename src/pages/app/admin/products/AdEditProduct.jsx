import {
  AppBrandDropdown,
  AppContentWrapper,
  AppPageLoader,
  AppSubmitBtn,
} from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import customFetch from "@/utils/customFetch";
import { discountedPrice } from "@/utils/functions";
import showError from "@/utils/showError";
import showSuccess from "@/utils/showSuccess";
import { X } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLoaderData, useParams } from "react-router-dom";

const AdEditProduct = () => {
  const { parentCategories, editUser } = useLoaderData();
  document.title = `${editUser?.name} | ${import.meta.env.VITE_APP_NAME}`;

  const { currentUser } = useSelector((store) => store.currentUser);
  const slug = currentUser?.user_details?.slug;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { id: editId } = useParams();

  const [form, setForm] = useState({
    category: "",
    name: "",
    code: "",
    description: "",
    price: "",
    discountType: "",
    discountAmt: "",
    discountedPrice: "",
    stock: 0,
  });
  const [dbData, setDbData] = useState({});
  const [brandOption, setBrandsOption] = useState("");
  const [validImages, setValidImages] = useState([]);
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  // ---------------------------------------------

  useEffect(() => {
    if (editUser) {
      const dPrice = discountedPrice(
        editUser?.price,
        editUser?.discount?.[0]?.discount_type,
        editUser?.discount?.[0]?.discount_amt
      );

      setDbData({
        ...dbData,
        category: editUser?.category_id ?? "",
        name: editUser?.name ?? "",
        code: editUser?.product_code || "",
        description: editUser?.description || "",
        price: editUser?.price || "",
        discountType: editUser?.discount?.[0]?.discount_type || "",
        discountAmt: editUser?.discount?.[0]?.discount_amt || "",
        discountedPrice: dPrice,
        stock: editUser?.stock || 0,
      });

      setBrandsOption({
        ...brandOption,
        value: editUser?.brand_id || "",
        label: editUser?.brand_name || "",
      });

      setValidImages((prev) => ({ ...prev, ...editUser?.images }));
      setImages((prev) => ({ ...prev, ...editUser?.images }));
      setCoverImage(editUser?.cover_image);
    }
  }, [editUser]);

  // ---------------------------------------------

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);

    const price = updatedForm.price;
    const discountType = updatedForm.discountType;
    const discountAmt = updatedForm.discountAmt;

    if (price && discountType && discountAmt) {
      validateDiscount(price, discountType, discountAmt);
    }
  };

  // ---------------------------------------------

  const validateDiscount = (price, type, discount) => {
    let discountedPrice = "";
    setForm({ ...form, discountedPrice: discountedPrice });

    if (type === "inr" && Number(discount) > Number(price)) {
      setForm({
        ...form,
        price: price,
        discountType: type,
        discountAmt: discount,
        discountedPrice: discountedPrice,
      });
      setErrors({
        ...errors,
        discountAmt: "Discount amount cannot be more than price",
      });
    } else if (type === "%" && Number(discount) > 100) {
      setForm({
        ...form,
        price: price,
        discountType: type,
        discountAmt: discount,
        discountedPrice: discountedPrice,
      });
      setErrors({
        ...errors,
        discountAmt: "Discount percentage cannot be more than 100%",
      });
    } else {
      setErrors({ ...errors, discountAmt: "" });
      const dis =
        type === "inr"
          ? Number(discount)
          : (Number(discount) / 100) * Number(price);
      const discountedPrice = Number(price) - dis;
      setForm({
        ...form,
        price: price,
        discountType: type,
        discountAmt: discount,
        discountedPrice: discountedPrice,
      });
    }
  };

  // ---------------------------------------------

  const resetErrors = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ---------------------------------------------

  const resetForm = () => {
    setForm({
      ...form,
      category: "",
      name: "",
      code: "",
      description: "",
      price: "",
      discountType: "",
      discountAmt: "",
      discountedPrice: "",
      stock: 0,
    });
    setBrandsOption("");
    setErrors([]);
    setCoverImage(null);
    setValidImages([]);
    setImages([]);
  };

  // ---------------------------------------------

  // Image related functions start ----------------

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const filteredFiles = files.filter((file) => file.size <= 200 * 1024);
    if (filteredFiles.length < files.length) {
      setErrors({
        ...errors,
        images: "Some images were too large (over 200KB) and were not added.",
      });
    }
    const newImages = filteredFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setValidImages((prevImages) => [...prevImages, ...newImages]);
    setImages((prevImages) => [...prevImages, ...filteredFiles]);
  };

  const setAsCover = (index) => {
    setCoverImage(images[index]);
  };

  const removeImage = (index) => {
    setValidImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    if (coverImage && images[index] === coverImage) {
      setCoverImage(null);
    }
  };

  // Image related functions end ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <AppContentWrapper>
      {isLoading && <AppPageLoader />}

      <div className="flex flex-row justify-between items-center bg-muted my-1 p-2">
        <h3 className="font-semibold text-xl tracking-widest text-muted-foreground">
          Add new product
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
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
                autoFocus={true}
                value={form.category || dbData.category}
                onChange={handleChange}
                onSelect={resetErrors}
              >
                <option value="">- Select -</option>
                {parentCategories?.map((category) => {
                  return (
                    <optgroup
                      key={nanoid()}
                      className="text-muted-foreground font-light"
                      label={category.name}
                    >
                      {category?.children?.map((child) => {
                        return (
                          <option
                            key={nanoid()}
                            className="text-black"
                            value={child.id}
                          >
                            {child.name}
                          </option>
                        );
                      })}
                    </optgroup>
                  );
                })}
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
              <AppBrandDropdown
                brandOption={brandOption}
                setBrandsOption={setBrandsOption}
              />
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
                value={form.name || dbData.name}
                onChange={handleChange}
                onKeyUp={resetErrors}
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
                value={form.code || dbData.code}
                onChange={handleChange}
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
                htmlFor="description"
                className="capitalize text-muted-foreground tracking-wider mb-2"
              >
                product description <span className="text-red-500">*</span>
              </Label>
              {/* <AppTextEditor /> */}
              <Textarea
                id="description"
                name="description"
                placeholder="Product description here"
                value={form.description || dbData.description}
                onChange={handleChange}
              ></Textarea>
              <span className="text-red-500 text-xs tracking-wider">
                {errors?.description}
              </span>
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <div className="basis-1/3 flex flex-col justify-start items-start">
              <Label
                htmlFor="price"
                className="capitalize text-muted-foreground tracking-wider mb-2"
              >
                price <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="price"
                name="price"
                placeholder="Product price here"
                value={form.price}
                onChange={handleChange}
              />
              <span className="text-red-500 text-xs tracking-wider">
                {errors?.price}
              </span>
            </div>
            <div className="basis-1/3 flex flex-col justify-start items-start">
              <Label
                htmlFor="discountType"
                className="capitalize text-muted-foreground tracking-wider mb-2"
              >
                discount
              </Label>
              <div className="flex flex-row gap-2 w-full">
                <select
                  name="discountType"
                  id="discountType"
                  className="flex h-10 w-[150px] items-center justify-between rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  value={form.discountType}
                  onChange={handleChange}
                >
                  <option value="">- Select -</option>
                  <option value={`inr`}>INR</option>
                  <option value={`%`}>%</option>
                </select>
                <Input
                  type="text"
                  id="discountAmt"
                  name="discountAmt"
                  placeholder="Discount amount here (if any)"
                  value={form.discountAmt}
                  onChange={handleChange}
                />
              </div>
              <span className="text-red-500 text-xs tracking-wider">
                {errors?.discountAmt}
              </span>
            </div>
            <div className="basis-1/3 flex flex-col justify-start items-start">
              <Label
                htmlFor="discountedPrice"
                className="capitalize text-muted-foreground tracking-wider mb-2"
              >
                discounted price (non-editable)
              </Label>
              <Input
                type="text"
                id="discountedPrice"
                name="discountedPrice"
                placeholder="Auto-calculated discounted price"
                readOnly={true}
                value={form.discountedPrice || ""}
                onChange={handleChange}
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
                placeholder="Product starting stock here"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
              <span className="text-red-500 text-xs tracking-wider">
                {errors?.stock}
              </span>
            </div>
            <div className="basis-1/3 flex flex-col justify-start items-start"></div>
            <div className="basis-1/3 flex flex-col justify-start items-start"></div>
          </div>
        </div>
        <div className="border border-muted rounded-sm p-4 mt-3">
          <div className="flex gap-4 mb-0">
            <div className="basis-1/3 flex flex-col justify-start items-start">
              <Label
                htmlFor="stock"
                className="capitalize text-muted-foreground tracking-wider mb-2"
              >
                images <span className="text-red-500">*</span>
              </Label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                name="images"
                id="images"
                className="flex h-10 w-full rounded-sm border border-input bg-background p-2 text-base file:border-1 file:text-sm file:border-0 file:bg-warning-foreground/10 file:py-0.5 file:text-warning-foreground file:font-normal md:text-xs"
              />
            </div>
            <div className="basis-1/3 flex flex-col justify-start items-start"></div>
            <div className="basis-1/3 flex flex-col justify-start items-start"></div>
          </div>
          <div className="mb-4 -mt-1">
            <span className="text-red-500 text-xs tracking-wider">
              {errors?.images}
            </span>
          </div>
          <div className="w-full flex gap-4 mb-4">
            {coverImage && (
              <div className="mb-4 p-0.5 w-32 rounded-sm">
                <p className="text-center text-primary text-sm">Cover Image</p>
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="Cover"
                  className="w-full h-24 object-cover rounded"
                />
              </div>
            )}

            <div className="w-full flex gap-4">
              {/* {validImages.map((img, index) => {
                return (
                  <div key={index} className="relative w-32">
                    <img
                      src={img.preview}
                      alt="Uploaded"
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs p-0.5 rounded"
                      onClick={() => removeImage(index)}
                    >
                      <X size={14} />
                    </button>
                    <button
                      type="button"
                      className="absolute bottom-1 left-1 bg-primary text-white text-xs p-1 rounded"
                      onClick={() => setAsCover(index)}
                    >
                      Set Cover
                    </button>
                  </div>
                );
              })} */}
            </div>
          </div>
        </div>
        <div className="border border-muted rounded-sm p-4 mt-3 flex flex-row justify-center items-center gap-4">
          <AppSubmitBtn
            text={`Add Product`}
            isLoading={isLoading}
            customClass={`min-w-32 tracking-widest uppercase`}
          />
          <Link to={`/admin/${slug}/products`}>
            <Button
              type="button"
              variant="outline"
              className="tracking-widest uppercase"
            >
              Back to List
            </Button>
          </Link>
        </div>
      </form>
    </AppContentWrapper>
  );
};
export default AdEditProduct;

// ----------------------------------------------

export const loader = async ({ params }) => {
  const { id } = params;
  let editUser = {};

  try {
    const dbParents = await customFetch.get(`/master/parent-categories`);
    const parentCategories = dbParents.data;

    const dbBrands = await customFetch.get(`/master/brands`);
    const brands = dbBrands.data;

    const response = await customFetch.get(`/admin/products/${id}`);

    if (response?.status === 200) {
      editUser = response?.data?.data;
    }

    return { parentCategories, brands, editUser };
  } catch (error) {
    console.log(error);
    showError(error?.response?.data?.errors);
    return false;
  }
};

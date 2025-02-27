import { useState } from "react";
import Select from "react-select";
import noImage from "@/assets/images/no-image.jpg";
import { useLoaderData } from "react-router-dom";

const AppBrandDropdown = ({ brandOption, setBrandsOption }) => {
  const { brands } = useLoaderData();
  const [localState, setLocalState] = useState("");

  const options = [];
  brands?.map((brand) => {
    const img = brand.logo
      ? import.meta.env.VITE_BASE_URL + brand.logo
      : noImage;

    const option = {
      value: brand.id,
      label: brand.name,
      imageUrl: img,
    };
    options.push(option);
  });

  const customSingleValue = ({ data }) => (
    <span className="flex items-center text-muted-foreground -mt-6">
      {data.imageUrl ? (
        <img
          src={data.imageUrl}
          alt={import.meta.env.VITE_APP_NAME}
          className="h-5 w-auto max-w-6 mr-3"
        />
      ) : (
        <img
          src={noImage}
          alt={import.meta.env.VITE_APP_NAME}
          className="h-5 w-auto max-w-6 mr-3"
        />
      )}
      <span className="text-black">{data.label}</span>
    </span>
  );

  const customOption = (props) => (
    <span {...props.innerProps} className="flex items-center p-2 text-black">
      {props.data.imageUrl ? (
        <img
          src={props.data.imageUrl}
          alt=""
          className="h-5 w-auto max-w-6 mr-3"
        />
      ) : (
        <img
          src={noImage}
          alt={import.meta.env.VITE_APP_NAME}
          className="h-5 w-auto max-w-6 mr-3"
        />
      )}
      {props.data.label}
    </span>
  );

  const handleChange = async (selected) => {
    setLocalState(selected);
    setBrandsOption(selected);
  };

  return (
    <Select
      id="brand"
      name="brand"
      styles={style}
      options={options}
      components={{ SingleValue: customSingleValue, Option: customOption }}
      onChange={handleChange}
      value={brandOption}
      className="flex h-auto w-full items-center justify-between rounded-md border border-input bg-background px-0 py-0 text-sm focus:outline-none"
    />
  );
};
export default AppBrandDropdown;

const style = {
  control: (base, state) => ({
    ...base,
    borderTop: state.isFocused ? 0 : 0,
    borderLeft: 0,
    borderRight: 0,
    borderBottom: 0,
    boxShadow: state.isFocused ? 0 : 0,
    "&:hover": {
      border: state.isFocused ? 0 : 0,
    },
    width: "100%",
    background: "inherit",
  }),
};

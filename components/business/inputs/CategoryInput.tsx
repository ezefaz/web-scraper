import { Select } from "@nextui-org/react";
import React from "react";

type CategoryInputProps = {
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
};

const CategoryInput: React.FC<CategoryInputProps> = ({
  label,
  selected,
  onClick,
}) => {
  return (
    <div>
      <Select
        variant="underlined"
        label="Categoría"
        placeholder="Seleccione una categoría"
        className="max-w-xs"
      >
        {/* {animals.map((animal) => (
                    <SelectItem key={animal.value} value={animal.value}>
                      {animal.label}
                    </SelectItem>
                  ))} */}
      </Select>
    </div>
  );
};

export default CategoryInput;

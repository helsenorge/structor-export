import React from "react";

import { ValueSetComposeIncludeConcept } from "fhir/r4";
import { useTranslation } from "react-i18next";
import "./Select.css";

type Props = {
  options: ValueSetComposeIncludeConcept[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  placeholder?: string;
  compact?: boolean;
};

const Select = ({
  options,
  onChange,
  value,
  placeholder,
  compact,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={`selector ${compact ? "compact" : ""}`}>
      <select onChange={onChange} value={value || ""}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((item, index) => (
          <option key={index} value={item.code}>
            {t(item.display || "")}
          </option>
        ))}
      </select>
      <span className="down-arrow-icon" />
    </div>
  );
};

export default Select;

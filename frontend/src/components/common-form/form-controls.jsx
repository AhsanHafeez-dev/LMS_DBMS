import { Input } from "../ui/input"
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function FormControls({ formControls = [], formData, setFormData }) {
  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const hasError = getControlItem.error ? true : false;

    switch (getControlItem.componentType) {
      case "input":
        if (getControlItem.type === "number") {
          element = (
            <div>
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type="number"
                value={currentControlItemValue}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                min="0"
                step="0.01"
                className={hasError ? "border-red-500" : ""}
              />
              {hasError && (
                <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
              )}
            </div>
          );
        } else {
          element = (
            <div>
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                value={currentControlItemValue}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                className={hasError ? "border-red-500" : ""}
              />
              {hasError && (
                <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
              )}
            </div>
          );
        }
        break;
      case "select":
        element = (
          <div>
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={currentControlItemValue}
            >
              <SelectTrigger className={hasError ? "border-red-500" : ""}>
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
            )}
          </div>
        );
        break;
      case "textarea":
        element = (
          <div>
            <Textarea
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              value={currentControlItemValue}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
            )}
          </div>
        );
        break;

      default:
        element = (
          <div>
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={getControlItem.type}
              value={currentControlItemValue}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}>
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          <div className="mt-1">{renderComponentByType(controlItem)}</div>
        </div>
      ))}
    </div>
  );
}

export default FormControls;
import { cx } from "../utils/cx";

/**
 * PixelInput — the base text-input primitive of the design system.
 *
 * Backwards compatible with the original label/type/value/onChange/
 * placeholder/autoComplete/required API. Adds optional extras used by the
 * auth pages:
 *  - `error`        friendly validation message; renders a red border and
 *                    the message beneath the field
 *  - `endAdornment` a node (e.g. a show/hide password button) rendered
 *                    inside the input on the right
 *  - `onBlur`/`name` for field-level validation and native form semantics
 */
export default function PixelInput({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  required,
  error,
  name,
  id,
  endAdornment,
}) {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="block" htmlFor={inputId}>
      <span className="mb-1 block font-heading text-[10px] uppercase tracking-widest text-muted">{label}</span>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={cx(
            "pixel-corners-sm w-full border-2 bg-ink px-3 py-2 font-body text-lg text-[#fffffe] placeholder-border-light outline-none transition-colors",
            endAdornment ? "pr-11" : "",
            error ? "border-hp focus:border-hp" : "border-border focus:border-accent"
          )}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{endAdornment}</div>
        )}
      </div>
      {error && (
        <span id={errorId} className="mt-1 block text-sm text-hp">
          {error}
        </span>
      )}
    </label>
  );
}

import { useEffect, useState } from 'react';

/**
 * Button to copy the provided value to the clipboard.
 *
 * If `navigator.clipboard.writeText` is not available, returns `null`.
 */
export function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [value]);

  if (!navigator?.clipboard?.writeText) return null;

  const copy = () => {
    navigator.clipboard.writeText(value).then(() => setCopied(true));
  };

  return (
    <span>
      <button type="button" onClick={copy}>
        Copy
      </button>{' '}
      <small>{copied && 'Copied!'}</small>
    </span>
  );
}

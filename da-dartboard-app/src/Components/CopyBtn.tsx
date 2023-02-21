import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Button } from '@mui/material'

/**
 * Button to copy the provided value to the clipboard.
 *
 * If `navigator.clipboard.writeText` is not available, returns `null`.
 */
export const CopyBtn: FunctionComponent<PropsWithChildren<{ value: string }>> = (props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [props.value]);

  if (!navigator?.clipboard?.writeText) return <div/>;

  const copy = async () => {
    await navigator.clipboard.writeText(props.value);
    setCopied(true);
    setTimeout(() => {setCopied(false)}, 2000);
  };

  return (
    <span>
      <Button type="button" onClick={copy}>
        {props.children}
      </Button>
      <small>{copied && ' Copied!'}</small>
    </span>
  );
}

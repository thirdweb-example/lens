// Modified from official Lens example:
// https://github.com/lens-protocol/api-examples/blob/master/src/ethers.service.ts

import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { utils } from "ethers";
import { omit } from "./helpers";

export const signedTypeData = (
  signer: any,
  domain: TypedDataDomain,
  types: Record<string, any>,
  value: Record<string, any>
) => {
  // remove the __typedname from the signature!
  return signer._signTypedData(
    omit(domain, ["__typename"]),
    omit(types, ["__typename"]),
    omit(value, ["__typename"])
  );
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};

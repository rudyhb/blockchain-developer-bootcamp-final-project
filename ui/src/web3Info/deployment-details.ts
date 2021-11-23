import { Fragment, JsonFragment } from "@ethersproject/abi";

export const deploymentAddress: { [chainId: number]: string } = {};
export const abi: { [chainId: number]: ReadonlyArray<Fragment | JsonFragment | string> } = {};

export const apiAddress: string = "http://localhost:8081";

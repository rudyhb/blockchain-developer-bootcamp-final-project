import React from "react";
import { apiAddress } from "../web3Info/deployment-details";
import { BigNumber } from "ethers";
import { BaseResponse, performFetch } from "../api/api";

export interface UserData extends BaseResponse {
  nftId: BigNumber;
  address: string;
  role: string;
  status: string;
  chainId: string;
}

export default function useUserData(
  authToken?: string,
  fetchIntervalMs = 10_000
) {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const disabled = !authToken || !userData;

  React.useEffect(() => {
    if (!authToken) return;
    let cancel = false;

    const doWork = () => {
      performFetch<UserData>(`${apiAddress}/userData`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${authToken}`
        }
      })
        .then(data => {
          if (!cancel) setUserData(data);
        })
        .catch(e => {
          if (!cancel) setError(`Error retrieving user data: ${e.message}`);
        })
        .then(() => {
          window.setTimeout(() => {
            if (!cancel) doWork();
          }, fetchIntervalMs);
        });
    };

    doWork();

    return () => {
      cancel = true;
    };
  }, [disabled, authToken, fetchIntervalMs]);

  const setStatus: React.Dispatch<string> = (status: string) => {
    if (disabled) return;

    performFetch<UserData>(`${apiAddress}/userData`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        status
      })
    })
      .then(data => {
        setUserData(data);
      })
      .catch(e => {
        setError(`Error retrieving user data: ${e.message}`);
      });
  };

  return {
    userData,
    error,
    disabled,
    setStatus
  };
}

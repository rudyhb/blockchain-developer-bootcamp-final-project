import React from "react";
import { BigNumber } from "ethers";
import useSignMessage from "./useSignMessage";
import { apiAddress } from "../web3Info/deployment-details";
import { useWeb3React } from "@web3-react/core";
import { BaseResponse, performFetch } from "../api/api";

interface SignInState {
  loading: boolean;
  requestId?: string;
  messageToSign?: any;
  signature?: string;
  token?: string;
  error?: string;
}

interface SignInSetLoading {
  type: "setLoading";
}

interface SignInSetMessageToSign {
  type: "setMessageToSign";
  value: any;
  requestId: string;
}

interface SignInSetSignature {
  type: "setSignature";
  value: string;
}

interface SignInSetToken {
  type: "setToken";
  value: string;
}

interface SignInSetError {
  type: "setError";
  value: string;
}

interface SignOut {
  type: "signOut";
}

type SignInAction =
  | SignInSetMessageToSign
  | SignInSetSignature
  | SignInSetToken
  | SignInSetLoading
  | SignInSetError
  | SignOut;

const signInReducer = (
  state: SignInState,
  action: SignInAction
): SignInState => {
  switch (action.type) {
    case "setLoading":
      return {
        loading: true
      };
    case "setMessageToSign":
      return {
        ...state,
        messageToSign: action.value,
        requestId: action.requestId
      };
    case "setSignature":
      return {
        ...state,
        signature: action.value
      };
    case "setToken":
      return {
        ...state,
        token: action.value,
        loading: false
      };
    case "setError":
      return {
        loading: false,
        error: action.value
      };
    case "signOut":
      return {
        loading: false
      };
    default:
      throw new Error("invalid signInReducer action type");
  }
};

interface AuthResponse extends BaseResponse {
  requestId: string;
  message: any;
}

interface Auth2Response extends BaseResponse {
  token: string;
}

export default function useSignIn({ nftId }: { nftId?: BigNumber }) {
  const [
    { messageToSign, signature, token, loading, requestId, error },
    dispatch
  ] = React.useReducer(signInReducer, { loading: false });
  const sign = useSignMessage();
  const { chainId } = useWeb3React();

  const disabled = !nftId || loading || !chainId || !sign;
  const signedIn = !!token;

  React.useEffect(() => {
    if (!sign || !messageToSign || signature) return;

    let cancel = false;

    sign(messageToSign)
      .then(signature => {
        if (!cancel)
          dispatch({
            type: "setSignature",
            value: signature
          });
      })
      .catch(e => {
        if (!cancel)
          dispatch({
            type: "setError",
            value: e.message
          });
      });

    return () => {
      cancel = true;
    };
  }, [messageToSign, sign, signature]);

  React.useEffect(() => {
    if (!signature || !requestId || token) return;

    let cancel = false;

    performFetch<Auth2Response>(
      `${apiAddress}/auth?requestId=${requestId}&signature=${signature}`,
      {
        method: "GET",
        headers: {
          accept: "application/json"
        }
      }
    )
      .then(data => {
        if (!cancel)
          dispatch({
            type: "setToken",
            value: data.token
          });
      })
      .catch(e => {
        if (!cancel)
          dispatch({
            type: "setError",
            value: `Error logging in with signature: ${e.message}`
          });
      });

    return () => {
      cancel = true;
    };
  }, [signature, requestId, token]);

  const signIn = () => {
    if (disabled) return;
    performFetch<AuthResponse>(
      `${apiAddress}/auth?nftId=${nftId}&chainId=${chainId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json"
        }
      }
    )
      .then(data => {
        dispatch({
          type: "setMessageToSign",
          value: data.message,
          requestId: data.requestId
        });
      })
      .catch(e => {
        dispatch({
          type: "setError",
          value: `Error getting message to sign: ${e.message}`
        });
      });
  };

  const signOut = () => {
    dispatch({
      type: "signOut"
    });
  };

  return {
    disabled,
    signedIn,
    signIn,
    signOut,
    token,
    error
  };
}

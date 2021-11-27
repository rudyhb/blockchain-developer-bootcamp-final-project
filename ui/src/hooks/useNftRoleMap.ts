import React from "react";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";
import useNftOwner from "./useNftOwner";

export interface RoleMap {
  [address: string]: string;
}

const getAddressFromEvent = (event: any) => {
  if (event && event.args && event.args[0]) return event.args[0] as string;
  throw new Error("invalid format from event");
};

export default function useNftRoleMap({
  contract,
  nftId
}: {
  contract: Contract | null;
  nftId: BigNumber | null;
}) {
  const [roleMap, setRoleMap] = React.useState<RoleMap | null>();
  const [error, setError] = React.useState<string | null>(null);
  const [addresses, setAddresses] = React.useState<string[] | null>(null);
  const [, owner] = useNftOwner({ contract, nftId });
  const [uniqueSymbol, setUniqueSymbol] = React.useState(Symbol());
  const updateRoleMap = () => {
    setUniqueSymbol(Symbol());
  };

  React.useEffect(() => {
    if (!nftId || !contract || !owner) return;
    setError(null);
    let cancel = false;

    const filterSetRole = contract.filters.SetRole(null, nftId);

    contract
      .queryFilter(filterSetRole)
      .then(setRoleEvents => {
        if (cancel) return;
        const addressesFromEvents: { [address: string]: boolean } = {
          [owner]: true
        };
        setRoleEvents.forEach(event => {
          const address = getAddressFromEvent(event);
          addressesFromEvents[address] = true;
        });
        setAddresses(Object.keys(addressesFromEvents));
      })
      .catch(e => {
        if (cancel) return;
        setError(e.message);
      });

    return () => {
      cancel = true;
    };
  }, [nftId, contract, owner, uniqueSymbol]);

  React.useEffect(() => {
    if (!nftId || !contract || !addresses || error) return;
    let cancel = false;

    const map: RoleMap = {};

    const setRole = async (address: string) => {
      const role = (await contract.getRoleFor(address, nftId)) as string;
      if (role) {
        map[address] = role;
      }
    };

    Promise.all(addresses.map(address => setRole(address)))
      .then(() => {
        setRoleMap(map);
      })
      .catch(e => {
        if (!cancel) setError(e.message);
      });

    return () => {
      cancel = true;
    };
  }, [nftId, contract, addresses, error]);

  return [error, roleMap, updateRoleMap] as const;
}

// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LinkFolioModule = buildModule("LinkFolioModule", (m) => {
  const linkfolio = m.contract("LinkFolio");
  return { linkfolio };
});

export default LinkFolioModule;

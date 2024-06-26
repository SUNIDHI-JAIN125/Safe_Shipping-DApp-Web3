// import React from 'react';
// import { useWallet, Wallet as SolanaWallet } from '@solana/wallet-adapter-react';
// import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react';
// import { ChevronDownIcon } from '@chakra-ui/icons';
// import { truncatedPublicKey } from '../util/helper';

// const ConnectWalletButton = () => {
//   const { wallets, select, connected, publicKey, wallet, connect } = useWallet();
//   const toast = useToast();

//   const copyPublicKey = () => {
//     navigator.clipboard.writeText(publicKey?.toBase58() || '');
//     toast({ status: "success", title: 'Copied Address' });
//   };

//   const onConnectWallet = async (wallet: SolanaWallet) => {
//     try {
//       select(wallet.adapter.name);
//       await connect();
//     } catch (error) {
//       console.error("Wallet Error: ", error);
//       toast({ status: "error", title: 'Failed to connect wallet' });
//     }
//   };

//   return (
//     <Menu>
//       <MenuButton
//         as={Button}
//         colorScheme='messenger'
//         w="13rem"
//         borderRadius="0.5rem"
//         rightIcon={
//           connected && wallet ? (
//             <Box h="1.5rem" w="1.5rem" mr="1rem">
//               <img
//                 src={wallet.adapter.icon}
//                 alt={`${wallet.adapter.name} Icon`}
//               />
//             </Box>
//           ) : <ChevronDownIcon color="white" w="1.5rem" h="1.5rem" />
//         }
//       >
//         {!connected && <Text fontSize="1.2rem">Connect Wallet</Text>}
//         {connected && wallet !== null && (
//           <Text fontSize="1.2rem">
//             {truncatedPublicKey(publicKey!.toString(), 4)}
//           </Text>
//         )}
//       </MenuButton>

//       {connected && (
//         <MenuList w="10rem" p="0.5rem" borderRadius="1rem">
//           <MenuItem h="3rem" onClick={copyPublicKey}>
//             <Text fontSize="1.2rem" color="blue.400" fontWeight={500}>Copy Address</Text>
//           </MenuItem>
//           <MenuItem h="3rem" onClick={async () => {
//             if (wallet == null) return;
//             await wallet.adapter.disconnect();
//           }}>
//             <Text fontSize="1.2rem" color="blue.400" fontWeight={500}>Disconnect</Text>
//           </MenuItem>
//         </MenuList>
//       )}

//       {!connected && wallets && (
//         <MenuList w="10rem" p="0.5rem" borderRadius="1rem">
//           {wallets.map((wallet: SolanaWallet) => (
//             <MenuItem
//               key={wallet.adapter.name}
//               h="3rem"
//               onClick={() => onConnectWallet(wallet)}
//             >
//               <Flex gap="1rem" align="center">
//                 <Box w="2rem" h="2rem">
//                   <img
//                     width={100}
//                     loading="lazy"
//                     src={wallet.adapter.icon}
//                     alt={`${wallet.adapter.name} Icon`}
//                   />
//                 </Box>
//                 <Text fontSize="1.2rem" ml={2} fontWeight={600} color="gray.500">
//                   {wallet.adapter.name}
//                 </Text>
//               </Flex>
//             </MenuItem>
//           ))}
//         </MenuList>
//       )}
//     </Menu>
//   );
// };

// export default ConnectWalletButton;

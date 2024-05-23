import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  Spinner,
  Container,
  Spacer,
} from "@chakra-ui/react";
import { Alchemy, Network } from "alchemy-sdk";
import { useState } from "react";
import { MetaMaskButton } from "./Components/Button/Button";
import "./App.css";

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getNFTsForOwner() {
    const apiKey = import.meta.env.VITE_APP_ALCHEMY_API_KEY;

    if (!apiKey) {
      console.error("VITE_ALCHEMY_API_KEY is not defined");
      return;
    }

    setLoading(true);

    const config = {
      apiKey: apiKey,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.nft.getNftsForOwner(userAddress);
    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.ownedNfts.length; i++) {
      const tokenData = alchemy.nft.getNftMetadata(
        data.ownedNfts[i].contract.address,
        data.ownedNfts[i].tokenId
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
    setLoading(false);
  }

  const updateUser = ({ accounts }) => {
    if (accounts.length > 0) {
      setUserAddress(accounts[0]);
    }
    console.log(`Accounts passed! ${accounts[0]}`);
  };

  return (
    <Box w="100vw" h="100vh">
      <Center>
        <Flex
          alignItems={"center"}
          justifyContent="flex-end"
          flexDirection={"column"}
        >
          <Heading
            className="heading-text"
            mb={0}
            fontSize={36}
            alignSelf={"flex-start"}
          >
            NFT Indexer 🖼
          </Heading>
          <MetaMaskButton updateUser={updateUser} />
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={"center"}
      >
        <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
          value={userAddress}
          placeholder="Submit an address"
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
        />
        <Spacer h={100} />
        {userAddress && (
          <button
            onClick={getNFTsForOwner}
            style={{
              width: "22vw",
              height: "5vh",
              marginTop: "36px",
            }}
          >
            {loading ? <Spinner size="xl" /> : "Fetch NFTs"}
          </button>
        )}

        <Heading my={36}>Here are your NFTs:</Heading>
        {hasQueried ? (
          results.ownedNfts.length < 1 ? (
            <Container
              borderRadius={15}
              margin={40}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              padding={20}
              h={"50vh"}
              backgroundColor={"red"}
            >
              <Text
                fontWeight={"bold"}
                fontSize={"1.5rem"}
                color={"#242424"}
                textDecorationColor={"red"}
                textShadow={"2px 2px 2px  #000"}
              >
                There are no NFTs for this address.
              </Text>
            </Container>
          ) : (
            <SimpleGrid w={"90vw"} columns={4} spacing={24}>
              {results.ownedNfts.map((e, i) => {
                return (
                  <Flex
                    flexDir={"column"}
                    color="white"
                    bg="blue"
                    w={"20vw"}
                    key={e.id}
                  >
                    <Box>
                      <b>Name:</b>{" "}
                      {tokenDataObjects[i].title?.length === 0
                        ? "No Name"
                        : tokenDataObjects[i].title}
                    </Box>
                    <Image
                      src={
                        tokenDataObjects[i]?.rawMetadata?.image ??
                        "https://via.placeholder.com/200"
                      }
                      alt={"Image"}
                    />
                  </Flex>
                );
              })}
            </SimpleGrid>
          )
        ) : (
          "Please make a query! The query may take a few seconds..."
        )}
      </Flex>
    </Box>
  );
}

export default App;

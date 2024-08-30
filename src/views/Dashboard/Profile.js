import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { config } from "config";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState({});
  const [inProgress, setProgress] = useState(false);
  const { colorMode } = useColorMode();
  const avatar = config.url + user.avatar;

  const OnUpdateUser = async (e) => {
    e.preventDefault();
    setProgress(true);

    const new_data = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address,
    };

    const url = config.url + '/MapApi/user/' + user.id + '/';

    try {
      const response = await axios.put(url, new_data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      console.log("Update response", response.data);
      sessionStorage.setItem('user', JSON.stringify(response.data));
      setProgress(false);
      Swal.fire(
        'Succès',
        'Utilisateur mis à jour avec succès. Vos modifications seront prises en compte lors de la prochaine connexion',
        'success'
      );
    } catch (error) {
      setProgress(false);
      Swal.fire('Erreur', 'Veuillez réessayer', 'error');
      console.log('Erreur:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${config.url}/MapApi/user_retrieve/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });
      console.log("User information", response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur :', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px", lg: "100px" }}>
      <Flex
        direction={{ sm: "column", md: "row" }}
        mb="24px"
        maxH="330px"
        justifyContent={{ sm: "center", md: "space-between" }}
        align="center"
        backdropFilter="blur(21px)"
        boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
        border="1.5px solid"
        borderColor={borderProfileColor}
        bg={bgProfile}
        p="24px"
        borderRadius="20px"
      >
        <Flex
          align="center"
          mb={{ sm: "10px", md: "0px" }}
          direction={{ sm: "column", md: "row" }}
          w={{ sm: "100%" }}
          textAlign={{ sm: "center", md: "start" }}
        >
          <Avatar
            me={{ md: "22px" }}
            src={avatar}
            w="80px"
            h="80px"
            borderRadius="15px"
          />
          <Flex direction="column" maxWidth="100%" my={{ sm: "14px" }}>
            <Text
              fontSize={{ sm: "lg", lg: "xl" }}
              color={textColor}
              fontWeight="bold"
              ms={{ sm: "8px", md: "0px" }}
            >
              {user.first_name} {user.last_name}
            </Text>
            <Text
              fontSize={{ sm: "sm", md: "md" }}
              color="gray.400"
              fontWeight="semibold"
            >
              {user.email}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Card p="16px" my="24px">
        <CardHeader p="12px 5px" mb="12px">
          <Flex direction="column">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Modifier les informations du profil
            </Text>
          </Flex>
        </CardHeader>
        <CardBody px="5px">
          <form onSubmit={OnUpdateUser}>
            <Grid
              templateColumns={{ sm: "1fr", md: "1fr 1fr", xl: "repeat(2, 1fr)" }}
              gap="24px"
            >
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input
                  type="text"
                  value={user.first_name}
                  onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Prénom</FormLabel>
                <Input
                  type="text"
                  value={user.last_name}
                  onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Téléphone</FormLabel>
                <Input
                  type="text"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Adresse</FormLabel>
                <Input
                  type="text"
                  value={user.address}
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                />
              </FormControl>
            </Grid>

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={inProgress}
              type="submit"
            >
              Sauvegarder les modifications
            </Button>
          </form>
        </CardBody>
      </Card>
    </Flex>
  );
}

export default Profile;

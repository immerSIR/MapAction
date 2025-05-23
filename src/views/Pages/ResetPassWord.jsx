import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Alert,
  AlertIcon,
  VStack,
  useToast
} from '@chakra-ui/react';
import { config } from "../../config";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1); // Step 1: Request code, Step 2: Reset password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const history = useHistory()
  const toast = useToast();
  const handleRequestCode = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${config.url}/MapApi/password/`, { email });
      setSuccess("Un code a été envoyé à votre adresse email.");
      setStep(2);
    } catch (err) {
      setError("Impossible d'envoyer le code. Vérifiez votre adresse email.", err);
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${config.url}/MapApi/reset_password/`, {
        email,
        code,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      });
  
      toast({
        title: "Mot de passe réinitialisé",
        description: "Vous allez être redirigé vers la page de connexion.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      setTimeout(() => {
        history.push('/auth/signin/'); // change selon ta route
      }, 3000);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la réinitialisation. Vérifiez les informations.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log("Erreur lors de la réinitialisation", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading mb={6} size="lg" textAlign="center">
        Réinitialisation du mot de passe
      </Heading>
      <VStack spacing={4}>
        

        {step === 1 && (
          <>
            <FormControl isRequired>
              <FormLabel>Adresse email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <Button isLoading={loading} colorScheme="blue" onClick={handleRequestCode} w="full">
              Envoyer le code
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <FormControl isRequired>
              <FormLabel>Code reçu par email</FormLabel>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Nouveau mot de passe</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Button isLoading={loading} colorScheme="green" onClick={handleResetPassword} w="full">
              Réinitialiser le mot de passe
            </Button>
          </>
        )}

        {step === 2 && (
          <Button variant="link" onClick={() => setStep(1)} colorScheme="blue">
            Revenir à la saisie de l'email
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default ResetPasswordPage;

import { Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Link, Text, useToast } from '@chakra-ui/react'
import { Form, Formik, FormikHelpers } from 'formik'
import NextLink from 'next/link'
import React, { useEffect } from 'react'
import { FaApple, FaGoogle } from 'react-icons/fa'
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase.config'
import { registerUser, updateUserProfile } from '../features/auth/auth'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'

interface RegistrationValues {
  fullname: string, email: string, phonenumber: string, password: string, password_confirmation: string
}

export default function Register() {

  const dispatch = useDispatch<AppDispatch>();
  const { status, user } = useSelector((state: RootState) => state.auth);
  const toast = useToast();

  // Password
  const [show, setShow] = React.useState(false)

  const handleRegistration = async (values: RegistrationValues, { resetForm }: FormikHelpers<RegistrationValues>) => {
    dispatch(registerUser({
      email: values.email,
      fullName: values.fullname,
      password: values.password,
      phoneNumber: values.phonenumber
    }))
      .unwrap()
      .then((response) => {
        console.log("Register Dispatch Call response: ", response);
        toast({
          title: "Registration Successful",
          description: `You can now proceed to Login.`,
          status: "success",
        });

        resetForm();
      })
      .catch((error) => [
        toast({
          title: "Registration Failed",
          description: `${error.message}`,
          status: "error",
        })
      ])
  }

  return (
    <Flex align="center" justify="center" h={"100vh"}>

      {/* Login Form */}
      <Flex align={"center"} justify={"center"} direction="column" width={"xs"}>
        <Heading color={"green.400"} mb={3} fontWeight="light">Sign Up</Heading>

        <Formik
          initialValues={{ fullname: "", email: "", phonenumber: "", password: "", password_confirmation: "" }}
          onSubmit={handleRegistration}

        >
          {({ handleChange, handleBlur, values }) => (
            <Form style={{ width: "100%" }}>
              <FormControl mt={2}>
                <Input type='text' name='fullname' placeholder='First Name' value={values.fullname} onChange={handleChange} onBlur={handleBlur} />
              </FormControl>

              <FormControl mt={2}>
                <Input type='email' name='email' placeholder='Your Email Address' value={values.email} onChange={handleChange} onBlur={handleBlur} />
              </FormControl>

              <FormControl mt={2}>
                <Input type='text' name='phonenumber' placeholder='Phone Number' value={values.phonenumber} onChange={handleChange} onBlur={handleBlur} />
              </FormControl>

              <FormControl mt={2}>
                <Input type='password' name='password' placeholder='Your password...' value={values.password} onChange={handleChange} onBlur={handleBlur} />
              </FormControl>

              <FormControl mt={2}>
                <Input type='password' name='password_confirmation' placeholder='Confirm Password' value={values.password} onChange={handleChange} onBlur={handleBlur} />
              </FormControl>

              <Button isLoading={status === "loading"} disabled={status == "loading"} type="submit" variant={'outline'} my={3} width={"full"} colorScheme="green">Sign Up</Button>
            </Form>
          )}
        </Formik>

        <Link _hover={{ cursor: 'pointer' }} as={NextLink} href={"/sign-in"}><Text>I have an account. Sign In Now</Text></Link>

        <Flex width={"full"} align={"center"} my="4">
          <Box h={"1px"} width={"50%"} bgColor={"orange.500"} />
          <Text mx={2} color={"orange.500"}>OR</Text>
          <Box h={"1px"} width={"50%"} bgColor={"orange.500"} />
        </Flex>

        <Button leftIcon={<FaGoogle />} variant={'outline'} my={3} width={"full"} colorScheme="blue">Sign Up with Google</Button>
        <Button leftIcon={<FaApple />} variant={'outline'} my={3} width={"full"} colorScheme="blackAlpha">Sign Up with Apple</Button>
      </Flex>

    </Flex>
  )
}
